import pathway as pw
from pathway.xpacks.llm import embedders, llms, parsers, prompts, splitters
from pathway.xpacks.llm.question_answering import BaseRAGQuestionAnswerer
import logging
from typing import List, Dict
import os
from pathlib import Path
import fitz  # PyMuPDF for PDF processing

class DescriptiveRAGPipeline:
    def __init__(
        self,
        model_name: str = "mistralai/Mistral-7B-Instruct-v0.1",
        host: str = "0.0.0.0",
        port: int = 8000,
        chunk_size: int = 500,
        chunk_overlap: int = 50,
        knowledge_base_path: str = "knowledge_base"
    ):
        self.app_host = host
        self.app_port = port
        self.knowledge_base_path = knowledge_base_path
        
        # Initialize LLM
        self.llm = llms.OllamaLLM(
            model=model_name,
            temperature=0.3,  # Lower temperature for more focused responses
            max_tokens=1024
        )

        # Initialize components for RAG
        self.embedder = embedders.SentenceTransformerEmbedder(
            model_name="all-mpnet-base-v2"
        )
        
        self.splitter = splitters.RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ".", " "]
        )
        
        self.parser = parsers.MarkdownParser()

    def load_pdfs_from_directory(self) -> List[Dict[str, str]]:
        """Load all PDFs from the knowledge base directory"""
        documents = []
        pdf_dir = Path(self.knowledge_base_path)
        
        if not pdf_dir.exists():
            raise FileNotFoundError(f"Knowledge base directory not found: {self.knowledge_base_path}")
        
        for pdf_path in pdf_dir.glob("*.pdf"):
            try:
                doc = fitz.open(pdf_path)
                text = ""
                for page in doc:
                    text += page.get_text()
                
                documents.append({
                    "content": text,
                    "metadata": {
                        "source": pdf_path.name,
                        "type": "pdf"
                    }
                })
                doc.close()
                logging.info(f"Processed PDF: {pdf_path.name}")
            except Exception as e:
                logging.error(f"Error processing {pdf_path}: {str(e)}")
                continue
        
        if not documents:
            raise ValueError("No valid PDF documents found in knowledge base directory")
        
        return documents

    def create_knowledge_base(self):
        """Initialize the knowledge base from PDF documents"""
        documents = self.load_pdfs_from_directory()
        
        # Create table from documents
        docs_table = pw.Table.from_pylist(documents)

        # Process and index documents
        processed_docs = (
            docs_table
            .select(pw.this.content, pw.this.metadata)
            .select(
                chunks=self.splitter(pw.this.content),
                metadata=pw.this.metadata
            )
        )

        # Create vector store
        self.doc_store = pw.vector_store.VectorStoreServer(
            processed_docs,
            embedder=self.embedder,
            parser=self.parser
        )
        logging.info("Knowledge base created successfully")

    def generate_descriptive_prompt(self, query: str, contexts: List[str]) -> str:
        """Create a detailed prompt for descriptive writing"""
        return f"""You are an educational assistant designed to help students improve their writing skills for competitive exams. Follow these guidelines:
        1. Answer questions in a style as given in the provided context.
        2. Use simple, clear, concise language.
        3. If the answer isn't in the context, provide a well-structured answer based on general knowledge.
        4. Do not speculate or invent information.
        5. Maintain a professional tone and organize responses clearly.
        6. Encourage follow-up questions.
        7. Provide examples to clarify concepts.
        8. Keep answers focused and exam-friendly.

        Context information:
        {'-' * 40}
        {' '.join(contexts)}
        {'-' * 40}
        
        Question: {query}
        
        Provide a precise and well-structured answer that:
        1. Starts with a clear introduction
        2. Develops key points with specific details
        3. Uses descriptive language
        4. Maintains a coherent structure
        5. Concludes with a summary

        If applicable, ask if further clarification is needed.
        
        Answer:"""

    def process_query(self, query: str, top_k: int = 5) -> str:
        """Process a query and generate a detailed response"""
        contexts = self.doc_store.search(query, k=top_k)
        prompt = self.generate_descriptive_prompt(query, contexts)
        return self.llm.complete(prompt)

    def run(self):
        """Initialize and run the RAG server"""
        try:
            self.create_knowledge_base()
            
            app = BaseRAGQuestionAnswerer(
                llm=self.llm,
                indexer=self.doc_store,
                search_topk=5,
                prompt_template=self.generate_descriptive_prompt
            )
            
            app.build_server(host=self.app_host, port=self.app_port)
            app.run_server()
        except Exception as e:
            logging.error(f"Error running server: {str(e)}")
            raise

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    pipeline = DescriptiveRAGPipeline()
    pipeline.run()
