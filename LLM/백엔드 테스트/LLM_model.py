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



# .env 파일 로드
load_dotenv(os.getenv("/home/student/pjenv-3.11/rag_project_org", "pj.env"))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")






# 임베딩 모델 로드
try:
    embedding_model = SentenceTransformer("jhgan/ko-sroberta-multitask")
except Exception as e:
    raise RuntimeError(f"임베딩 모델 로드 중 오류 발생: {e}")




# Weaviate 클라이언트 초기화 (v4 방식)
client = weaviate.Client("http://localhost:8081")
if not client.is_ready():
    raise ConnectionError("Weaviate 서버가 준비되지 않았습니다.")
print("Weaviate 서버에 성공적으로 연결되었습니다!")

# 스키마 이름 설정
schema_name = "Recipe_v1"
# 스키마 존재 여부 확인
try:
    existing_schema = client.schema.get()
    existing_classes = [cls["class"] for cls in existing_schema.get("classes", [])]
    if schema_name not in existing_classes:
        raise ValueError(f"'{schema_name}' 클래스가 Weaviate에 존재하지 않습니다.")
    else:
        print(f"'{schema_name}' 클래스가 Weaviate에 이미 존재합니다.")
except Exception as e:
    print(f"스키마 확인 중 오류 발생: {e}")
    raise






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
            "Recipe_v1", ["content", "_additional {certainty}"]
        ).with_near_vector({"vector": query_vector}).with_limit(top_k).do()

        recipes = result.get("data", {}).get("Get", {}).get("Recipe_v1", [])
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
    app.run(host='0.0.0.0', port=5001, debug=True)  # 디버그 모드 활성화




