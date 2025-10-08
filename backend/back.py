from flask import Flask, request, jsonify
from langchain.chains import RetrievalQA
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
import logging
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Importing CORS from flask_cors

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define constants
PERSIST_DIRECTORY = "doc_db"

# Initialize HuggingFace embeddings
embedding = HuggingFaceEmbeddings()

# Load the vector store from the persisted directory
def load_vectorstore():
    try:
        vectorstore = Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embedding)
        logger.info("Vector store loaded successfully.")
        return vectorstore
    except Exception as e:
        logger.error(f"Failed to load vector store: {e}")
        raise

# Set up the QA chain
def setup_qa_chain():
    try:
        vectorstore = load_vectorstore()
        retriever = vectorstore.as_retriever()
        llm = ChatGroq(model="llama-3.2-3b-preview", temperature=0.4)
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True
        )
        logger.info("QA chain setup completed.")
        return qa_chain
    except Exception as e:
        logger.error(f"Failed to set up QA chain: {e}")
        raise

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, supports_credentials=True)  # Ensure this is applied to all routes

# Initialize the QA chain
qa_chain = setup_qa_chain()
system_prompt = "You are a descriptive/essay writing expert or coach, you are required to provide a concise paragraphed answer for the question "

# Define the query endpoint
@app.route("/query", methods=["POST"])
def query_document():
    try:
        # Get the query from the request body
        data = request.get_json()
        if not data or "query" not in data:
            return jsonify({"error": "Query is required"}), 400

        query = data["query"]
        full_query = system_prompt + query
        logger.info(f"Processing query: {full_query}")
        
        # Run the query through the QA chain
        response = qa_chain.invoke({"query": query})
        return jsonify({
            "query": query,
            "result": response["result"]
        })
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        return jsonify({"error": f"An error occurred: {e}"}), 500

# Root endpoint for health check
@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Document QA API is running!"})

# Run the Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
