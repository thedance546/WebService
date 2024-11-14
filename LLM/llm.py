import os
import weaviate
from flask import Flask, request, jsonify
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, PromptTemplate
from langchain_openai import ChatOpenAI
from sentence_transformers import SentenceTransformer
import weaviate
from weaviate.auth import AuthApiKey
from weaviate import WeaviateClient
from dotenv import load_dotenv

# .env 파일 로드
env_path = "./.env"
load_dotenv(env_path)

# 환경 변수 가져오기
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
WEAVIATE_API_KEY = os.getenv("WEAVIATE_API_KEY")
WEAVIATE_URL = os.getenv("WEAVIATE_URL")

# 디버깅: 환경 변수 출력
print(f"OpenAI API Key: {OPENAI_API_KEY}")
print(f"Weaviate API Key: {WEAVIATE_API_KEY}")
print(f"Weaviate URL: {WEAVIATE_URL}")

if not OPENAI_API_KEY or not WEAVIATE_API_KEY or not WEAVIATE_URL:
    print("환경 변수가 올바르게 로드되지 않았습니다. .env 파일을 확인하세요.")
    exit(1)


# Flask 앱 설정
app = Flask(__name__)

# Weaviate 클라이언트 설정
auth_config = AuthApiKey(api_key=WEAVIATE_API_KEY)
client = weaviate.Client(
    url=WEAVIATE_URL,
    auth_client_secret=auth_config
)

# Weaviate 연결 확인
try:
    if client.is_ready():
        print("Weaviate에 성공적으로 연결되었습니다!")
    else:
        print("Weaviate 연결 실패")
except Exception as e:
    print(f"Weaviate 연결 중 오류 발생: {e}")

# 임베딩 모델 설정
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# LangChain의 OpenAI LLM 설정
llm = ChatOpenAI(model="gpt-4", openai_api_key=OPENAI_API_KEY)

# 프롬프트 템플릿 설정
prompt = ChatPromptTemplate(
    input_variables=['input', 'search_results'],
    messages=[
        HumanMessagePromptTemplate(
            prompt=PromptTemplate(
                input_variables=['input', 'search_results'],
                template='You are an expert chef. Answer the question based on the search results.\n'
                         '<Question>: {input}\n'
                         '<Search Results>: {search_results}'
            )
        )
    ]
)

# LangChain LLMChain 생성
chain = LLMChain(llm=llm, prompt=prompt)

# Weaviate 검색 함수
def search_weaviate(query_text):
    """ Weaviate에서 질문을 임베딩하여 유사한 데이터를 검색 """
    query_embedding = embedding_model.encode(query_text)
    result = client.query.get("Recipe", ["content"]) \
        .with_near_vector({"vector": query_embedding}) \
        .with_limit(3) \
        .do()
    
    try:
        search_results = "\n".join([item['content'] for item in result['data']['Get']['Recipe']])
        print("검색 결과:", search_results)
    except KeyError:
        search_results = "No relevant information found."
        print("검색 결과 없음")
    return search_results

# 질문을 받아서 Weaviate에서 검색 후 LangChain을 통해 답변 생성
def generate_response(question):
    search_results = search_weaviate(question)
    response = chain.run(input=question, search_results=search_results)
    return response

# Flask API 라우트 설정
@app.route("/ask", methods=["POST"])
def ask_question():
    data = request.json
    question = data.get("question", "")
    
    if not question:
        return jsonify({"error": "No question provided"}), 400
    
    response = generate_response(question)
    return jsonify({"response": response})

# 서버 실행
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
