import os
import re
import weaviate
from weaviate import Client
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from langchain_core.output_parsers import StrOutputParser
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, PromptTemplate, SystemMessagePromptTemplate
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


# 분할된 CSV 파일 경로 리스트
#file_list = [f"/home/student/pjenv-3.11/rag_project_org/recipe/recipe_data_part{i}.csv" for i in range(1, 13)]
file_list = [f"/app/recipe/recipe_data_part{i}.csv" for i in range(1, 13)]




# safe_search 함수
def safe_search(pattern, text, group=1, default="unknown"):
    import re
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        print(f"Pattern '{pattern}' not found in text:\n{text[:200]}...")
        return default
    return match.group(group)

# single_chunk_document_with_metadata 함수
def single_chunk_document_with_metadata(doc):
    doc_id = safe_search(r'id:\s*(\d+)\n', doc)
    name = safe_search(r'name:\s*(.*?)\n', doc)
    ingredients = safe_search(r'ingredients:\s*(.*?)\n', doc)
    recipe = safe_search(r'recipe:\s*(.*?)\n', doc)
    description = safe_search(r'description:\s*(.*?)\n', doc)
    image = safe_search(r'image:\s*(.*?)\n', doc)
    totalTime = safe_search(r'totalTime:\s*(.*?)\n', doc)
    recipeYield = safe_search(r'recipeYield:\s*(.*)', doc)

    chunk_content = (
        f"Title: {name}. "
        f"Ingredients: {ingredients}. "
        f"Recipe: {recipe}. "
        f"Description: {description}. "
        f"Image: {image}. "
        f"TotalTime: {totalTime}. "
        f"RecipeYield: {recipeYield}."
    )

    chunk = {
        "doc_id": doc_id or "unknown",
        "name": name or "unknown",
        "content": chunk_content,
    }

    return chunk


# 모든 문서를 저장할 리스트
all_chunks_with_metadata = []

# 분할된 CSV 파일 처리
for file_path in file_list:
    try:
        # CSVLoader를 사용하여 데이터 로드
        loader = CSVLoader(file_path=file_path)
        data = loader.load()

        # 각 문서에 대해 청크 생성
        for doc in data:
            chunk = single_chunk_document_with_metadata(doc.page_content)
            all_chunks_with_metadata.append(chunk)

    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
        continue

# 결과 출력
for chunk in all_chunks_with_metadata[:5]:  # 처음 5개의 청크 출력
    print(f"Doc ID: {chunk['doc_id']}, Name: {chunk['name']}")
    print(f"Content: {chunk['content']}")
    print("=" * 80)







# Weaviate 클라이언트 초기화 (v4 방식)
client = weaviate.Client(WEAVIATE_URL)
if not client.is_ready():
    raise ConnectionError("Weaviate 서버가 준비되지 않았습니다.")
print("Weaviate 서버에 성공적으로 연결되었습니다!")


# 스키마 설정
def setup_schema(client):
    schema = {
        "class": "Recipescema",
        "description": "A class for storing recipe chunks with metadata",
        "vectorizer": "none",
        "properties": [
            {
                "name": "content",
                "description": "Full recipe content including title, ingredients, and recipe details.",
                "dataType": ["text"],
            },
            {
                "name": "doc_id",
                "description": "Unique identifier for the document.",
                "dataType": ["string"],
            },
            {
                "name": "name",
                "description": "The name of the recipe.",
                "dataType": ["string"],
            },
        ]
    }

    if "Recipescema" in [cls["class"] for cls in client.schema.get()["classes"]]:
        client.schema.delete_class("Recipescema")
        print("Existing 'Recipescema' schema deleted.")

    client.schema.create_class(schema)
    print("New 'Recipescema' schema created.")




# 5. 데이터 로드 및 처리
batch_size = 50
batch_chunks = []

for file_path in file_list:
    try:
        # CSV 파일 로드
        loader = CSVLoader(file_path=file_path)
        data = loader.load()
        print(f"Processing file: {file_path}")

        # 각 문서에 대해 청크 생성 및 배치 업로드
        for idx, doc in enumerate(data):
            try:
                # 청크 생성
                chunk = single_chunk_document_with_metadata(doc.page_content)
                embedding = embedding_model.encode(chunk["content"]).tolist()

                # 배치에 추가
                batch_chunks.append({
                    "content": chunk["content"],
                    "doc_id": chunk["doc_id"],
                    "name": chunk["name"],
                    "vector": embedding
                })

                # 배치 크기에 도달하면 업로드
                if len(batch_chunks) == batch_size:
                    with client.batch as batch:
                        for chunk_item in batch_chunks:
                            batch.add_data_object(
                                {
                                    "content": chunk_item["content"],
                                    "doc_id": chunk_item["doc_id"],
                                    "name": chunk_item["name"],
                                },
                                class_name="Recipescema",
                                vector=chunk_item["vector"]
                            )
                    print(f"Uploaded batch of {len(batch_chunks)} objects.")
                    batch_chunks = []  # 배치 초기화

            except Exception as inner_e:
                print(f"Error processing document {idx} in file {file_path}: {inner_e}")
                continue

        # 남은 데이터 업로드
        if batch_chunks:
            with client.batch as batch:
                for chunk_item in batch_chunks:
                    batch.add_data_object(
                        {
                            "content": chunk_item["content"],
                            "doc_id": chunk_item["doc_id"],
                            "name": chunk_item["name"],
                        },
                        class_name="Recipescema",
                        vector=chunk_item["vector"]
                    )
            print(f"Uploaded remaining batch of {len(batch_chunks)} objects.")
            batch_chunks = []

    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
        continue



















# LangChain과 OpenAI LLM 설정
llm = ChatOpenAI(model="gpt-4", openai_api_key=OPENAI_API_KEY)

# 시스템 메시지: AI의 역할과 응답 지침 설정
system_message_prompt = SystemMessagePromptTemplate.from_template(
    "You are a world-class recipe bot equipped to handle queries related to recipes, ingredients, cooking methods, and dietary restrictions.. "
    "질문과 제공된 검색 결과를 기반으로 재료와 레시피를 분리하여 깔끔하게 답변하세요. "
    "제공된 검색 결과에서 레시피 제목과 함께 링크를 같이 답변하세요."
    "링크는 Image: ['*.jpg', '*.jpg'] 형식으로 제공됩니다."
    "답변이 불가능할 경우 '관련된 레시피를 찾을 수 없습니다.'라고 답변하세요."
)

# 사용자 메시지: 질문과 검색 결과를 전달
user_message_prompt = HumanMessagePromptTemplate.from_template(
    "질문: {question}\n\n"
    "검색 결과:\n{context}\n\n"
    "레시피의 상세과정은 물어본게 아니라면 생략하고 제목과 재료, 링크만 정렬해서 답변하세요."
    "링크는 Image: ['*.jpg', '*.jpg'] 형식으로 제공됩니다."
)


# ChatPromptTemplate 생성
prompt = ChatPromptTemplate.from_messages([system_message_prompt, user_message_prompt])

# 파서 설정
output_parser = StrOutputParser()


# LangChain LLMChain 생성
chain = prompt | llm | output_parser



# Weaviate 검색 함수
def search_weaviate(query_text, top_k=5, min_certainty=0.5):
    query_vector = embedding_model.encode(query_text).tolist()
    try:
        result = client.query.get(
            "Recipescema", ["content", "_additional {certainty}"]
        ).with_near_vector({"vector": query_vector}).with_limit(top_k).do()

        recipes = result.get("data", {}).get("Get", {}).get("Recipescema", [])
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


# 글로벌 변수 초기화
current_recipe_list = []


def generate_answer(question):
    """
    질문에 따라 레시피 목록 생성 및 상세 정보 반환
    """
    global current_recipe_list

    if not current_recipe_list:
        print("[DEBUG] 현재 current_recipe_list는 비어 있습니다.")
    else:
        print("[DEBUG] 현재 current_recipe_list에 저장된 레시피:")
        for idx, recipe in enumerate(current_recipe_list, start=1):
            print(f"  {idx}. {recipe['title']}")
    # 초기화 처리
    if question.lower() == "초기화":
        current_recipe_list = []
        return "기존 레시피 목록이 초기화되었습니다."

    # 사용자가 레시피 번호를 입력한 경우
    if question.isdigit():
        recipe_index = int(question) - 1
        if 0 <= recipe_index < len(current_recipe_list):
            # 선택된 레시피의 상세 정보 반환
            selected_recipe = current_recipe_list[recipe_index]
            response = chain.invoke({
            #context 수정사항 있음
                "context": f"Title: {selected_recipe['title']}\nIngredients: {selected_recipe['ingredients']}\nRecipe: {selected_recipe['recipe']}\nImage: {selected_recipe['Image']}",
                "question": f"{selected_recipe['title']} 레시피를 상세히 설명해 주세요."
            })
            return f"선택된 레시피 상세 정보:\n{response}"
        else:
            return "유효하지 않은 레시피 번호입니다. 다시 선택해주세요."

    # 첫 번째 질문 처리: 새로운 레시피 목록 생성
    if not current_recipe_list:
        # 벡터DB 검색 수행
        _, _, result_texts = search_weaviate(question, top_k=5)
        if not result_texts:
            return "관련된 레시피를 찾을 수 없습니다."

        # 새로운 레시피 목록 생성
        current_recipe_list = []
        recipe_context = "추천 레시피 목록:\n"
        for idx, text in enumerate(result_texts, start=1):
            try:
                title = text.split("Title: ")[1].split(".")[0]
                ingredients = text.split("Ingredients: ")[1].split(". Recipe:")[0]
                recipe = text.split("Recipe: ")[1].split(". Description:")[0]
                Image = text.split("Image: ")[1].split(". TotalTime:")[0]
            except IndexError:
                continue  # 텍스트 파싱 중 오류 발생 시 스킵

            # 레시피를 리스트에 저장
            current_recipe_list.append({
                "title": title,
                "ingredients": ingredients,
                "recipe": recipe,
                "Image": Image
            })

            # 출력용 컨텍스트 생성
            recipe_context += f"{idx}. {title}\n이미지:{Image}"

        # LangChain 체인을 사용해 응답 생성
        return recipe_context + "\n위 목록에서 원하는 레시피 번호를 선택하세요."

    # 그 외의 경우: 잘못된 입력 처리
    return "질문이 명확하지 않습니다. 원하는 레시피 번호를 알려주세요."



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
        response = generate_answer(question)
        return jsonify({"response": response}), 200
    except Exception as e:
        app.logger.error(f"Error during processing: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, debug=False)  # 디버그 모드 활성화