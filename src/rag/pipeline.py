from typing import Dict
from langchain.chains import RetrievalQA
from langchain.llms import HuggingFacePipeline
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch
import logging

__all__ = ['RAGPipeline']

class RAGPipeline:
    def __init__(self, vectorstore, model_name: str = "deepseek-ai/deepseek-coder-1.3b-base"):
        self.vectorstore = vectorstore
        self.model_name = model_name
        self.llm = self._initialize_llm()
        self.qa_chain = self._create_qa_chain()

    def _initialize_llm(self):
        """Initialize the language model"""
        try:
            tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                torch_dtype=torch.float16,
                device_map="auto"
            )

            pipe = pipeline(
                "text-generation",
                model=model,
                tokenizer=tokenizer,
                max_new_tokens=512,
                temperature=0.7,
                top_p=0.95,
                repetition_penalty=1.15
            )

            return HuggingFacePipeline(pipeline=pipe)
        except Exception as e:
            logging.error(f"Error initializing LLM: {str(e)}")
            raise

    def _create_qa_chain(self):
        """Create the QA chain"""
        try:
            return RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=self.vectorstore.as_retriever(
                    search_kwargs={"k": 3}
                )
            )
        except Exception as e:
            logging.error(f"Error creating QA chain: {str(e)}")
            raise

    def process_query(self, query: str) -> Dict:
        """Process a query and return response"""
        try:
            response = self.qa_chain({"query": query})
            return {
                "answer": response["result"],
                "source_documents": response.get("source_documents", [])
            }
        except Exception as e:
            logging.error(f"Error processing query: {str(e)}")
            raise 