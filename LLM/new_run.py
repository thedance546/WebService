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
#WEAVIATE_URL = os.getenv("WEAVIATE_URL", "http://weaviate_test:8080")

# 임베딩 모델 로드
try:
    embedding_model = SentenceTransformer("jhgan/ko-sroberta-multitask")
except Exception as e:
    raise RuntimeError(f"임베딩 모델 로드 중 오류 발생: {e}")

# Weaviate 클라이언트 초기화 (v4 방식)
client = weaviate.Client(WEAVIATE_URL)
if not client.is_ready():
    raise ConnectionError("Weaviate 서버가 준비되지 않았습니다.")
print("Weaviate 서버에 성공적으로 연결되었습니다!")

# LangChain과 OpenAI LLM 설정
llm = ChatOpenAI(model="gpt-4", openai_api_key=OPENAI_API_KEY)

# 시스템 메시지: AI의 역할과 응답 지침 설정
system_message_prompt = SystemMessagePromptTemplate.from_template(
    "You are a world-class recipe bot equipped to handle queries related to recipes, ingredients, cooking methods, and dietary restrictions.. "
    "질문과 제공된 검색 결과를 기반으로 재료와 레시피를 분리하여 깔끔하게 답변하세요. "
    "답변이 불가능할 경우 '관련된 레시피를 찾을 수 없습니다.'라고 답변하세요."
)

# 사용자 메시지: 질문과 검색 결과를 전달
user_message_prompt = HumanMessagePromptTemplate.from_template(
    "질문: {question}\n\n"
    "검색 결과:\n{context}\n\n"
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


# LangChain RAG에서 사용자 질문 처리
def generate_answer(question, result_texts):
    """
    Generate an answer using LangChain LLM with context.
    """
    print(f"LLM에 전달할 컨텍스트:\n{result_texts}\n")

    try:
        response = chain.invoke({
            "question": f"{question} 레시피 목록은 생략하고 추천 레시피의 제목과 선택 이유만 답변해주세요. "
                        f"사용재료, 쓰면 안되는 재료에 특히 집중해주세요. "
                        f"사용재료 중에 레시피에 포함되지 않는 재료가 있다면 가벼운 말투로 솔직히 말해주세요.",
            "context": result_texts
        })
        print(f"LLM 응답:\n{response}\n")
        return response
    except Exception as e:
        print("LLM 처리 중 오류:", e)
        return "오류가 발생했습니다."



# RAG 응답 생성
def generate_rag_answer(question):
    """
    질문에 따라 5개의 레시피를 검색하고, LangChain이 추론한 가장 적합한 레시피를 반환
    """
    # Weaviate에서 검색 수행
    _, _, result_texts = search_weaviate(question, top_k=5)
    if not result_texts:
        return "관련된 레시피를 찾을 수 없습니다."

    # LangChain에 전달할 컨텍스트 생성
    context = "\n\n".join(result_texts)

    # LangChain을 사용하여 추천 레시피 추출
    llm_response = generate_answer(question, context)

    # LangChain 응답에서 필요한 데이터 추출
    try:
        # 정규식을 사용하여 응답에서 데이터를 추출
        title = re.search(r"Title: (.+)", llm_response)
        ingredients = re.search(r"Ingredients: (.+)", llm_response)
        recipe = re.search(r"Recipe: (.+)", llm_response)
        image = re.search(r"Image: (.+)", llm_response)

        # 매칭된 데이터 가져오기
        title = title.group(1) if title else "정보 없음"
        ingredients = ingredients.group(1) if ingredients else "정보 없음"
        recipe = recipe.group(1) if recipe else "정보 없음"
        image = image.group(1) if image else "정보 없음"
    except Exception as e:
        return f"레시피 정보를 처리하는 중 오류가 발생했습니다: {e}"

    # 최종 응답 구성
    response = (
        f"추천 레시피:\n\n"
        f"제목: {title}\n"
        f"재료: {ingredients}\n"
        f"레시피: {recipe}\n"
        f"이미지: {image}\n\n"
        f"추천 이유:\n{llm_response}"
    )
    return response


def generate_sentence(data):
    # 필터링 함수: 유효하지 않은 값을 제거
    def is_valid(value):
        return value not in ["없음", None, 0]

    # 재료 정보
    detected_ingredients = ", ".join(
        [f"{ingredient['name']} {ingredient['quantity']}개" for ingredient in data["yolov5_results"]["detected_ingredients"]]
    )

    # 사용자 정보
    user_info = data["personalized_answers"]["user_info"]
    age_group = user_info.get("ageGroup", None)
    gender = user_info.get("gender", None)
    activity_level = user_info.get("activityLevel", None)
    health_goal = user_info.get("healthGoal", None)
    meal_times = user_info.get("mealTimes", [])
    meal_times = [time for time in meal_times if is_valid(time)]
    meal_times_str = ", ".join(meal_times)
    allergies = user_info.get("allergies", [])
    allergies = [allergy for allergy in allergies if is_valid(allergy)]
    food_categories = user_info.get("foodCategories", [])
    food_categories = [category for category in food_categories if is_valid(category)]

    # 문장 생성
    sentence = f"{detected_ingredients}를 사용한 레시피 타이틀 추천 목록 만들어줘."

    if allergies:
        sentence += f" {', '.join(allergies)}는 쓰면 안 돼."
    if is_valid(age_group) or is_valid(gender) or is_valid(activity_level) or is_valid(health_goal) or meal_times or food_categories:
        sentence += " 그리고 그 중에"
        if is_valid(activity_level):
            sentence += f" {activity_level} 수준인 운동량의"
        if is_valid(age_group):
            sentence += f" {age_group}"
        if is_valid(gender):
            sentence += f" {gender}이"
        if is_valid(health_goal):
            sentence += f" {health_goal} 중에도"
        if meal_times:
            sentence += f" {meal_times_str}에"
        if food_categories:
            sentence += f" {', '.join(food_categories)}로 분류된"
        sentence += " 먹을만한 요리를 추천해줘."

    return sentence

# 예시 JSON 데이터 2
Jsondata2 = {
    "yolov5_results": {
        "detected_ingredients": [
            { "name": "토마토", "quantity": 3 },
            { "name": "당근", "quantity": 2 },
            { "name": "양배추", "quantity": 1 }
        ]
    },
    "personalized_answers": {
        "user_info": {
            "ageGroup": None,
            "gender": None,
            "activityLevel": "없음",
            "healthGoal": 0,
            "allergies": [None],
            "mealTimes": [0],
            "foodCategories": ["없음"],
        }
    },
    "database_check": {
        "is_included_in_database": True
    }
}

response = generate_rag_answer(generate_sentence(Jsondata2))
print("Response:", response)

# Flask 앱 설정
app = Flask(__name__)

# Flask 앱 엔드포인트 개선
# 루트 경로에 대한 엔드포인트 추가
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Flask LLM API!"})

# '/ping' 엔드포인트 추가
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Server is running!"})


# '/ask/general' 엔드포인트: GPT-4 API를 통한 질문 응답
@app.route('/ask/general', methods=['POST'])
def ask_general():
    """
    GPT-4 단독 질문 처리 (LangChain 프롬프트 사용)
    """
    try:
        data = request.json
        if not data or "question" not in data:
            return jsonify({"error": "No question provided"}), 400
        
        question = data["question"]

        # LangChain의 체인을 통해 질문 처리
        response = chain.invoke({"question": question, "context": ""})  # context는 빈 값으로 전달
        return jsonify({"response": response}), 200
    except Exception as e:
        app.logger.error(f"Error during GPT processing: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route('/ask/recipe', methods=['POST'])
def ask_recipe():
    """
    RAG 시스템 기반 질문 처리
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON data provided"}), 400
        print(data)
        
        # JSON 데이터를 문장으로 변환
        query_text = generate_sentence(data)
        print(query_text)
        # Weaviate에서 검색 수행
        result_texts = search_weaviate(query_text)
        print(result_texts)
        if not result_texts:
            return jsonify({"response": "검색된 결과가 없습니다."}), 404

        # RAG 기반 응답 생성
        response = generate_rag_answer(query_text, result_texts)
        return jsonify({"response": response}), 200
    except Exception as e:
        app.logger.error(f"Error during RAG processing: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, debug=False)  # 디버그 모드 활성화d