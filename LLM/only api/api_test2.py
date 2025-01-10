import os
from flask import Flask, request, jsonify
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

# .env 파일 로드
env_path = os.path.join(os.getcwd(), "pj.env")
load_dotenv(env_path)

# 환경 변수 가져오기
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Flask 앱 설정
app = Flask(__name__)

# LangChain의 OpenAI LLM 설정
llm = ChatOpenAI(model="gpt-4", openai_api_key=OPENAI_API_KEY)

# 출력 파서 설정 (JSON 형식)
output_parser = StrOutputParser()

prompt = ChatPromptTemplate(
    input_variables=['input', 'search_results'],
    messages=[
        HumanMessagePromptTemplate(
            prompt=PromptTemplate(
                input_variables=['input', 'search_results'],
                template=(
                    "You are a world-class recipe bot equipped to handle queries related to recipes, ingredients, cooking methods, and dietary restrictions.\n"
                    "<Question>: {input}\n"
                    "<Search Results>: {search_results}\n"
                    "If the question is not related to cooking or ingredients, respond with: 'I'm only knowledgeable about food and cooking.'"
                )
            )
        )
    ]
)

# LangChain LLMChain 생성
chain = prompt | llm | output_parser



# 루트 경로에 대한 엔드포인트 추가
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Flask LLM API!"})

# '/ping' 엔드포인트 추가
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Server is running!"})


@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    if 'question' not in data:
        return jsonify({"error": "Missing 'question' parameter"}), 400

    question = data['question']
    search_results = data.get('search_results', "")
    
    # 질문 출력
    print(f"Received Question: {question}")
    print(f"Search Results: {search_results}")

    try:
        # LangChain 모델을 사용하여 질문에 대한 답변 생성
        answer = chain.invoke({"input": question, "search_results": search_results})

        # 생성된 답변 출력
        print(f"Generated Answer: {answer}")

        return jsonify({"answer": answer})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Flask 앱 실행
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5003, debug=False)
