from langchain.chains import RetrievalQA
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA

# Define constants]\
from dotenv import load_dotenv  
import os 
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
persist_directory = "doc_db"
embedding = HuggingFaceEmbeddings()

# Load the vector store from the persisted directory
vectorstore = Chroma(persist_directory=persist_directory, embedding_function=embedding)

# Set up the retriever and LLM
retriever = vectorstore.as_retriever()
llm = ChatGroq(
    model="llama-3.2-3b-preview",
    temperature=0.4
)

# Define the QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
    temperature=0.4
)

# Run the queries
system_prompt = "You are a descriptive/essay writing expert or coach, you are required to provide a concise paragraphed answer for the question "
query1 = " Write a short note on Beowulf"
response1 = qa_chain.invoke({"query": system_prompt + query1})
print(response1["result"])

query2 = "What does the document say about Bach in music?"
response2 = qa_chain.invoke({"query": system_prompt + query2})
print(response2["result"])
