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
llm = ChatOpenAI(model="gpt-4o", openai_api_key=OPENAI_API_KEY)

# 시스템 메시지: AI의 역할과 응답 지침 설정
system_message_prompt = SystemMessagePromptTemplate.from_template(
    "당신은 레시피, 요리 방법, 식이 제한, 음식 저장 방법에 대한 전문적인 AI 어시스턴트입니다. "
    "검색 결과가 제공된 경우 이를 우선적으로 사용하여 정확하고 세부적인 답변을 생성하세요. "
    "검색 결과가 제공되지 않은 경우 질문을 기반으로 일반적인 지식을 사용해 답변하세요. "
    "만약 답변이 불가능하다면 '관련된 정보를 찾을 수 없습니다.'라고 답변하세요."
)



# 사용자 메시지: 질문과 검색 결과를 전달
user_message_prompt = HumanMessagePromptTemplate.from_template(
    "질문: {question}\n\n"
    "검색 결과:\n{context}\n\n"
    "검색 결과가 제공되지 않은 경우에만 일반적인 지식을 사용하여 답변하세요. "
    "중복 없이 간결하고 명확한 형식으로 답변을 작성하세요."
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




def generate_answer(question, result_texts):
    """
    LLM을 통해 단일 레시피 추천 답변 생성.
    """
    try:
        response = chain.invoke({
            "question": f"{question}\n추천 레시피를 한 가지 선택하여 다음 형식으로 답변해주세요:\n\n"
                        "추천 레시피 제목: <레시피 제목>\n"
                        "재료: <레시피에 필요한 재료 목록>\n"
                        "레시피 만드는 법: <간단한 요리 방법>\n"
                        "선택 이유: <왜 이 레시피를 추천했는지에 대한 설명>\n",
            "context": result_texts
        })
        print(f"LLM 응답:\n{response}\n")
        return response
    except Exception as e:
        print("LLM 처리 중 오류:", e)
        return "오류가 발생했습니다."






def generate_rag_answer(question):
    """
    Weaviate에서 검색된 결과를 기반으로 LLM 답변 생성.
    검색 결과가 없으면 질문만을 기반으로 LLM 추론.
    """
    _, _, result_texts = search_weaviate(question, top_k=5)

    if result_texts:
        # 검색 결과가 있는 경우 단일 레시피 선택
        selected_recipe = result_texts[0]  # 첫 번째 레시피 선택
        llm_response = generate_answer(
            question=f"{question}와 관련된 레시피를 추천해 주세요. 추천 이유와 생략된 재료에 대해 코멘트를 추가해 주세요.",
            result_texts=selected_recipe
        )

        # LLM 응답에서 내용과 이미지 링크 분리
        contents_match = re.search(r"(?<=내용: ).*?(?=\n이미지:)", llm_response, re.DOTALL)
        contents = contents_match.group(0).strip() if contents_match else llm_response.strip()

        image_links_match = re.search(r"(?<=이미지 링크: ).*", llm_response)
        image_links = image_links_match.group(0).strip() if image_links_match else "NO Image"
    else:
        # 검색 결과가 없는 경우
        print("검색 결과가 없습니다. 질문을 기반으로 답변을 생성합니다.")
        llm_response = generate_answer(
            question=f"{question}와 관련된 레시피를 추천해 주세요. 추천 이유와 생략된 재료에 대해 코멘트를 추가해 주세요.",
            result_texts=""
        )
        contents = llm_response.strip()
        image_links = "이미지 없음"

    # 최종 JSON 응답
    response = {
        "contents": contents,
        "imageLink": image_links
    }
    return response










def generate_sentence(data):
    # 필터링 함수: 유효하지 않은 값을 제거
    def is_valid(value):
        return value not in ["없음", None, 0]

    # 재료 정보 (detectedIngredients)
    detected_ingredients = ", ".join(
        [f"{ingredient['name']} {ingredient['quantity']}개" for ingredient in data.get("detectedIngredients", [])]
    )

    # 저장된 재료 정보 (selectedStoredIngredients)
    stored_ingredients = ", ".join(
        [f"{ingredient['name']} {ingredient['quantity']}개 (소비기한: {ingredient['consumeBy']})"
         for ingredient in data.get("selectedStoredIngredients", [])]
    )

    # 사용자 정보 (userPreferences)
    user_preferences = data.get("userPreferences", {})
    age_group = user_preferences.get("ageGroup", None)
    gender = user_preferences.get("gender", None)
    health_goal = user_preferences.get("healthGoal", None)
    meal_times = user_preferences.get("mealTimes", [])
    meal_times = [time for time in meal_times if is_valid(time)]
    meal_times_str = ", ".join(meal_times)
    allergies = user_preferences.get("allergies", [])
    allergies = [allergy for allergy in allergies if is_valid(allergy)]
    food_categories = user_preferences.get("foodCategories", [])
    food_categories = [category for category in food_categories if is_valid(category)]

    # 추가 요청 사항 (additionalRequest)
    additional_request = data.get("additionalRequest", "").strip()

    # 문장 생성
    sentence = f"{detected_ingredients}를 사용한 레시피 타이틀 추천 목록 만들어줘."

    if stored_ingredients:
        sentence += f" 저장된 재료로는 {stored_ingredients}가 있어."

    if allergies:
        sentence += f" {', '.join(allergies)}는 쓰면 안 돼."
    
    if is_valid(age_group) or is_valid(gender) or is_valid(health_goal) or meal_times or food_categories:
        sentence += " 그리고 그 중에"
        if is_valid(health_goal):
            sentence += f" {health_goal}를 위한"
        if is_valid(age_group):
            sentence += f" {age_group}"
        if is_valid(gender):
            sentence += f" {gender}이"
        if meal_times:
            sentence += f" {meal_times_str}에"
        if food_categories:
            sentence += f" {', '.join(food_categories)}로 분류된"
        sentence += " 먹을만한 요리를 추천해줘."

    if additional_request:
        sentence += f" 추가 요청 사항: {additional_request}."

    return sentence




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
        context = data.get("context", "")  # context가 없으면 기본값으로 빈 문자열 사용

        # LangChain의 체인을 통해 질문 처리
        response = chain.invoke({"question": question, "context": context})  
        return jsonify({"response": response}), 200
    except Exception as e:
        print(f"Error during GPT processing: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    
@app.route('/ask/recipe', methods=['POST'])
def ask_recipe():
    try:
        data = request.json
        print(f"Received data: {data}")  # 요청 데이터 로그

        if not isinstance(data, dict):
            return jsonify({"error": "Invalid input format. Must be JSON."}), 400

        # JSON 데이터 검증 및 키 매핑
        detected_ingredients = data.get("detectedIngredients")
        if not detected_ingredients:
            return jsonify({"error": "'detectedIngredients' is missing"}), 400

        # 요청 데이터에서 문장 생성
        query_text = generate_sentence(data)
        print(f"Generated query: {query_text}")  # 생성된 문장 로그

        _, _, result_texts = search_weaviate(query_text)

        if not result_texts:
            return jsonify({"response": "검색된 결과가 없습니다."}), 404

        response = generate_rag_answer(query_text)
        return jsonify({"response": response}), 200
    except Exception as e:
        print(f"Error during RAG processing: {e}")
        return jsonify({"error": "Internal Server Error"}), 500



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, debug=True, use_reloader=False)
