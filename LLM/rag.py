import os
import re
import weaviate
from weaviate.connect import ConnectionParams
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from langchain_core.output_parsers import StrOutputParser
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_community.document_loaders import CSVLoader
from dotenv import load_dotenv
from tqdm import tqdm

# .env 파일 로드
load_dotenv("/home/student/pjenv-3.11/rag_project/pj.env")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


# Weaviate 클라이언트 초기화
client = weaviate.Client("http://localhost:8080")



# 7. 연결 확인
if client.is_ready():
    print("Weaviate에 성공적으로 연결되었습니다!")
else:
    raise ConnectionError("Weaviate 서버에 연결할 수 없습니다.")
# 코드 실행 후 연결 종료



# 임베딩 모델 로드
embedding_model = SentenceTransformer("jhgan/ko-sroberta-multitask")
try:
    embedding_model = SentenceTransformer("jhgan/ko-sroberta-multitask")
except Exception as e:
    raise RuntimeError(f"임베딩 모델 로드 중 오류 발생: {e}")


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

@app.route("/ask", methods=["POST"])
def ask_question():
    try:
        data = request.json
        print(f"Received data: {data}")
        
        question = data.get("question")
        if not question:
            return jsonify({"error": "No question provided"}), 400

        # Weaviate 검색 수행
        query_vector, filtered_results, result_texts = search_weaviate(question)
        if not result_texts:
            return jsonify({"response": "검색된 결과가 없습니다."}), 404

        # LLM 응답 생성
        response = generate_answer(question, result_texts)
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)  # 디버그 모드 활성화


'''# 스키마 생성
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
# 스키마 확인 및 생성
if "RecipeDocument" in [cls["class"] for cls in client.schema.get()["classes"]]:
    print("RecipeDocument 클래스가 이미 존재합니다. 기존 스키마를 사용합니다.")
else:
    try:
        client.schema.create(schema)
        print("스키마가 성공적으로 생성되었습니다!")
    except Exception as e:
        print(f"스키마 생성 중 오류 발생: {e}")



# CSV 파일 경로 지정 및 함수 호출
csv_file_path = "/home/student/pjenv-3.11/rag_project/resipi.csv"
loader = CSVLoader(file_path=csv_file_path)
data = loader.load()
print(f"총 문서 수: {len(data)}")
for i, item in enumerate(data[:5]):  # 첫 5개 데이터만 확인
    print(f"Document {i + 1}: {item.page_content}")

if not data:
    raise ValueError("CSV 파일이 비어 있거나 올바르지 않습니다.")


def enhanced_chunk_document_with_metadata(doc):
    # 데이터 추출
    doc_id = re.search(r'id:\s*(\d+)', doc).group(1)
    name = re.search(r'name:\s*(.*)', doc).group(1).strip()
    ingredients = re.search(r'ingredients:\s*(.*)', doc, re.DOTALL).group(1).strip()
    recipe = re.search(r'recipe:\s*(.*)', doc, re.DOTALL).group(1).strip()

    # 레시피 단계 분리
    recipe_steps = recipe.split('; ')

    # 청크 생성
    chunks = []

    # 제목 + 재료 청크
    chunks.append({
        "doc_id": doc_id,
        "name": name,
        "chunk_index": 0,
        "field_type": "ingredients",
        "content": f"Title: {name}. Ingredients: {ingredients}"
    })

    # 재료 + 첫 번째 레시피 단계
    chunks.append({
        "doc_id": doc_id,
        "name": name,
        "chunk_index": 1,
        "field_type": "ingredients_and_recipe",
        "content": f"Ingredients: {ingredients}. Recipe Step 1: {recipe_steps[0]}"
    })

    # 레시피 단계 슬라이딩 윈도우
    for i in range(len(recipe_steps) - 1):
        chunks.append({
            "doc_id": doc_id,
            "name": name,
            "chunk_index": i + 2,
            "field_type": "recipe_step",
            "content": f"Recipe Step {i + 1}: {recipe_steps[i]}. Recipe Step {i + 2}: {recipe_steps[i + 1]}"
        })

    # 마지막 레시피 단계 추가
    chunks.append({
        "doc_id": doc_id,
        "name": name,
        "chunk_index": len(recipe_steps) + 1,
        "field_type": "recipe_step",
        "content": f"Recipe Step {len(recipe_steps)}: {recipe_steps[-1]}"
    })

    return chunks




all_chunks_with_metadata = []

# 문서별 청크 생성
for doc in data:
    chunks = enhanced_chunk_document_with_metadata(doc.page_content)
    all_chunks_with_metadata.extend(chunks)

# 생성된 청크 출력
for chunk in all_chunks_with_metadata[4000:4020]:  # 처음 10개 청크 확인
    print(f"Doc ID: {chunk['doc_id']}, Name: {chunk['name']}, Chunk Index: {chunk['chunk_index']}")
    print(f"Field Type: {chunk['field_type']}")
    print(f"Content: {chunk['content']}\n")
    print("=" * 80)



# 청크 생성 및 Weaviate 업로드 함수
def upload_to_weaviate(data):
    print("Weaviate에 데이터 업로드 시작...")

    # 문서별 청크 생성 및 업로드
    for i, doc in enumerate(data):
        print(f"\nProcessing Document {i + 1}")
        print(f"Original Document Content:\n{doc.page_content}\n")

        # 청크 생성
        chunks = enhanced_chunk_document_with_metadata(doc.page_content)

        # 생성된 청크 업로드
        for chunk in chunks:
            try:
                # 임베딩 생성
                embedding = embedding_model.encode(chunk["content"]).tolist()

                # Weaviate에 데이터 업로드
                client.data_object.create(
                    data_object={
                        "content": chunk["content"],
                        "doc_id": chunk["doc_id"],
                        "name": chunk["name"],
                        "chunk_index": chunk["chunk_index"],
                        "field_type": chunk["field_type"],
                    },
                    class_name="RecipeDocument",
                    vector=embedding
                )
                print(f"Uploaded Chunk: {chunk}")
            except Exception as e:
                print(f"Error uploading chunk: {e}")

    print("데이터 업로드 완료!")

# 데이터 업로드 호출
upload_to_weaviate(data)

# Weaviate에 저장된 데이터 확인
result = client.query.get("RecipeDocument", ["content", "doc_id", "name", "chunk_index", "field_type"]).with_limit(10).do()
print("Weaviate에 저장된 데이터:", result)


'''


''' 옛날꺼
def search_weaviate(query_text, top_k=5, min_certainty=0.5):
    """
    Perform vector-based search in Weaviate with improved query expansion and filtering.
    """
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



# LangChain RAG에서 사용자 질문 처리
def generate_answer(question, result_texts):
    """
    Generate an answer using LangChain LLM with context.
    """
    context = "\n".join(result_texts)
    print(f"LLM에 전달할 컨텍스트:\n{context}\n")

    try:
        response = llm_chain.invoke({"question": question, "context": context})
        print(f"LLM 응답:\n{response}\n")
        return response
    except Exception as e:
        print("LLM 처리 중 오류:", e)
        return "오류가 발생했습니다."


# Flask 앱 설정
app = Flask(__name__)

# 질문에 대한 응답 생성
@app.route("/ask", methods=["POST"])
def ask_question():
    try:
        data = request.json
        print(f"Received data: {data}")
        
        question = data.get("question")
        if not question:
            return jsonify({"error": "No question provided"}), 400

        search_results = search_weaviate(question)
        if not search_results:
            return jsonify({"response": "No relevant data found."})

        response = chain.invoke(input=question, search_results="\n".join(search_results))
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500




if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)  # 디버그 모드 활성화
'''

