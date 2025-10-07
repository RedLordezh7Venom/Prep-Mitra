import os

from langchain_community.document_loaders import UnstructuredPDFLoader, DirectoryLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

import fitz  # PyMuPDF

# Custom Document structure similar to what DirectoryLoader returns
class Document:
    def __init__(self, page_content):
        self.page_content = page_content

# Path to your PDF file
pdf_path = "pdfs/"
from langchain_text_splitters import CharacterTextSplitter
from langchain.schema import Document

documents = []
# Open the PDF file using PyMuPDF
for file in os.listdir(pdf_path):
    doc = fitz.open(pdf_path + file)

    # Extract text from the PDF and store it in a list of LangChain Documents
    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)  # Load each page
        page_text = page.get_text("text")  # Extract the text from each page
        # Create a LangChain Document with page_content and metadata
        documents.append(Document(page_content=page_text, metadata={"page": page_num + 1}))

print(len(documents))

text_splitter = CharacterTextSplitter(
    chunk_size=2000,
    chunk_overlap=500
)

text_chunks = text_splitter.split_documents(documents)

persist_directory = "doc_db"
embedding = HuggingFaceEmbeddings()

vectorstore = Chroma.from_documents(
    documents=text_chunks,
    embedding=embedding,
    persist_directory=persist_directory
)
print(vectorstore)
retriever = vectorstore.as_retriever()
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    temperature=0.4,
    google_api_key=os.getenv("GOOGLE_API_KEY")  # Replace with your actual API key
)

#defining the qa chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)

query = "What does the document say about  Beowulf?"
response = qa_chain.invoke({"query":query})
print(response["result"])

query = "What does the document say about Bach in music?"
response = qa_chain.invoke({"query":system_promquery})
print(response["result"])   