import os
from typing import List
from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
import logging

class KnowledgeBaseLoader:
    def __init__(self, knowledge_base_path: str = "knowledge_base"):
        self.knowledge_base_path = knowledge_base_path
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
    def load_documents(self) -> List:
        """Load documents from the knowledge base directory"""
        try:
            loader = DirectoryLoader(
                self.knowledge_base_path,
                glob="**/*.txt",
                loader_cls=TextLoader
            )
            documents = loader.load()
            logging.info(f"Loaded {len(documents)} documents from knowledge base")
            return documents
        except Exception as e:
            logging.error(f"Error loading documents: {str(e)}")
            raise

    def create_vector_store(self, documents: List) -> FAISS:
        """Create vector store from documents"""
        try:
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            texts = text_splitter.split_documents(documents)
            
            vectorstore = FAISS.from_documents(
                documents=texts,
                embedding=self.embeddings
            )
            logging.info("Vector store created successfully")
            return vectorstore
        except Exception as e:
            logging.error(f"Error creating vector store: {str(e)}")
            raise 