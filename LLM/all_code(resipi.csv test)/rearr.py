import os
import re
import weaviate
from weaviate import Client
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from langchain_core.output_parsers import StrOutputParser
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, PromptTemplate
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_community.document_loaders import CSVLoader

# .env 파일 로드
load_dotenv(os.getenv("/home/student/pjenv-3.11/rag_project_org", "pj.env"))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
WEAVIATE_URL = os.getenv("WEAVIATE_URL", "http://weaviate_container:8080")

# 임베딩 모델 로드
try:
    embedding_model = SentenceTransformer("jhgan/ko-sroberta-multitask")
except Exception as e:
    raise RuntimeError(f"임베딩 모델 로드 중 오류 발생: {e}")



# CSV 파일 경로 지정 및 함수 호출
csv_file_path = "/app/resipi.csv"
'csv_file_path = "/home/student/pjenv-3.11/rag_project_org/resipi.csv"'
loader = CSVLoader(file_path=csv_file_path)
data = loader.load()
print(f"총 문서 수: {len(data)}")
for i, item in enumerate(data[:1]):  # 첫 데이터만 확인
    print(f"Document {i + 1}: {item.page_content}")

if not data:
    raise ValueError("CSV 파일이 비어 있거나 올바르지 않습니다.")






def single_chunk_document_with_metadata(doc):
    # 데이터 추출
    doc_id = re.search(r'id:\s*(\d+)', doc).group(1)
    name = re.search(r'name:\s*(.*)', doc).group(1).strip()
    ingredients = re.search(r'ingredients:\s*(.*)', doc, re.DOTALL).group(1).strip()
    recipe = re.search(r'recipe:\s*(.*)', doc, re.DOTALL).group(1).strip()

    # 단일 청크 생성
    chunk = {
        "doc_id": doc_id,
        "name": name,
        "chunk_index": 0,
        "field_type": "full_recipe",
        "content": f"Title: {name}. Ingredients: {ingredients}. Recipe: {recipe}"
    }

    return chunk

all_chunks_with_metadata = []

# 문서별 청크 생성
for doc in data:
    chunk = single_chunk_document_with_metadata(doc.page_content)
    all_chunks_with_metadata.append(chunk)

# 생성된 청크 출력
for chunk in all_chunks_with_metadata[4000:4001]:
    print(f"Doc ID: {chunk['doc_id']}, Name: {chunk['name']}, Chunk Index: {chunk['chunk_index']}")
    print(f"Field Type: {chunk['field_type']}")
    print(f"Content: {chunk['content']}\n")
    print("=" * 80)

for idx, chunk in enumerate(all_chunks_with_metadata):
    if "방울토마토" in chunk['content']:
        print(f"청크 {idx}: {chunk}")


# Weaviate 클라이언트 초기화 (v4 방식)
client = weaviate.Client(WEAVIATE_URL)
if not client.is_ready():
    raise ConnectionError("Weaviate 서버가 준비되지 않았습니다.")
print("Weaviate 서버에 성공적으로 연결되었습니다!")



# 새로운 스키마 정의
schema = {
    "class": "RecipeDocument",
    "description": "A class for storing recipe chunks with metadata",
    "vectorizer": "none",  # 자체 임베딩 비활성화
    "properties": [
        {"name": "content", "dataType": ["text"]},
        {"name": "doc_id", "dataType": ["string"]},
        {"name": "name", "dataType": ["string"]},
        {"name": "chunk_index", "dataType": ["int"]},
        {"name": "field_type", "dataType": ["string"]}
    ]
}

# 스키마 생성 (이미 존재하는 경우 예외 처리)
try:
    client.schema.create_class(schema)
    print("스키마가 성공적으로 생성되었습니다.")
except Exception as e:
    print("스키마 생성 중 오류가 발생했습니다:", e)

# 데이터 업로드
for chunk in all_chunks_with_metadata:
    # 고유한 doc_id를 사용하여 중복 확인
    gql_query = """
    {
        Get {
            RecipeDocument(where: {
                path: ["doc_id"]
                operator: Equal
                valueString: "%s"
            }) {
                doc_id
            }
        }
    }
    """ % chunk["doc_id"]

    try:
        response = client.query.raw(gql_query)
        existing_objects = response["data"]["Get"]["RecipeDocument"]

        if existing_objects:  # 중복 데이터가 존재하면 건너뜀
            print(f"중복 데이터 발견. 업로드를 건너뜁니다: {chunk['doc_id']}")
            continue
    except Exception as e:
        print(f"중복 확인 중 오류 발생: {e}")
        continue

    # 새로운 데이터 업로드
    embedding = embedding_model.encode(chunk["content"]).tolist()  # content 필드만 벡터화
    try:
        client.data_object.create(
            {
                "content": chunk["content"],
                "doc_id": chunk["doc_id"],
                "name": chunk["name"],
                "chunk_index": chunk["chunk_index"],
                "field_type": chunk["field_type"]
            },
            class_name="RecipeDocument",
            vector=embedding  # 사용자 정의 임베딩 벡터 포함
        )
        print(f"데이터 업로드 완료: {chunk['doc_id']}")
    except Exception as e:
        print(f"데이터 업로드 중 오류 발생: {e}")




# LangChain과 OpenAI LLM 설정
llm = ChatOpenAI(model="gpt-4", openai_api_key=OPENAI_API_KEY)

# 프롬프트 템플릿 설정
prompt = ChatPromptTemplate(
    input_variables=["question", "context"],
    messages=[
        HumanMessagePromptTemplate(
            prompt=PromptTemplate(
                input_variables=["question", "context"],
                template="You are an expert chef. Answer the question based on the context provided.\n"
                         "<Question>: {question}\n"
                         "<Context>: {context}"
            )
        )
    ]
)

# 파서 설정
output_parser = StrOutputParser()


# LangChain LLMChain 생성
chain = prompt | llm | output_parser



# Weaviate 검색 함수
def search_weaviate(query_text, top_k=5, min_certainty=0.5):
    query_vector = embedding_model.encode(query_text).tolist()
    try:
        result = client.query.get(
            "RecipeDocument", ["content", "_additional {certainty}"]
        ).with_near_vector({"vector": query_vector}).with_limit(top_k).do()

        recipes = result.get("data", {}).get("Get", {}).get("RecipeDocument", [])
        filtered_results = [
            recipe for recipe in recipes if recipe["_additional"]["certainty"] >= min_certainty
        ]

        if not filtered_results:
            print("검색된 결과가 없습니다.")
            return query_vector, [], []

        for i, recipe in enumerate(filtered_results):
            content = recipe.get("content", "No Content")
            certainty = recipe["_additional"]["certainty"]
            print(f"검색 결과 {i+1}: 유사도(확실성): {certainty:.2f}")
            print(f"내용: {content}\n")

        result_texts = [recipe["content"] for recipe in filtered_results]
        return query_vector, filtered_results, result_texts
    except Exception as e:
        print("Weaviate 검색 중 오류:", e)
        return query_vector, [], []







# LLM 응답 생성 함수
def generate_answer(question, result_texts):
    context = "\n".join(result_texts)
    if not context:
        return "검색된 결과가 없습니다."
    
    print(f"LLM에 전달할 컨텍스트:\n{context}\n")

    try:
        response = chain.invoke({"question": question, "context": context})
        print(f"LLM 응답:\n{response}\n")
        return response
    except Exception as e:
        print("LLM 처리 중 오류:", e)
        return "오류가 발생했습니다."

# Flask 앱 설정
app = Flask(__name__)




# Flask 앱 엔드포인트 개선
@app.route("/ask", methods=["POST"])
def ask_question():
    try:
        data = request.json
        if not data or "question" not in data:
            return jsonify({"error": "No question provided"}), 400
        
        question = data["question"]

        # Weaviate 검색
        _, _, result_texts = search_weaviate(question)
        if not result_texts:
            return jsonify({"response": "검색된 결과가 없습니다."}), 404

        # LLM 응답 생성
        response = generate_answer(question, result_texts)
        return jsonify({"response": response}), 200
    except Exception as e:
        app.logger.error(f"Error during processing: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, debug=True)  # 디버그 모드 활성화