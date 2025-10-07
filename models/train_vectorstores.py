import os
from langchain_community.document_loaders import UnstructuredPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
import fitz  # PyMuPDF
from langchain.schema import Document

# Define constants
pdf_path = "pdfs/"
persist_directory = "doc_db"
chunk_size = 2000
chunk_overlap = 500

# Prepare text splitter and embedding
text_splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
embedding = HuggingFaceEmbeddings()

# Load and split PDFs into documents
documents = []
for file in os.listdir(pdf_path):
    doc = fitz.open(pdf_path + file)
    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        page_text = page.get_text("text")
        documents.append(Document(page_content=page_text, metadata={"page": page_num + 1}))

# Split documents into chunks
text_chunks = text_splitter.split_documents(documents)

# Create and persist vector store
vectorstore = Chroma.from_documents(
    documents=text_chunks,
    embedding=embedding,
    persist_directory=persist_directory
)
vectorstore.persist()  # Save the vector store

print("Vector store saved successfully.")
