import streamlit as st
import logging
import os
import sys

# Add the current directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

# Now import the local modules
from knowledge_base import KnowledgeBaseLoader
from pipeline import RAGPipeline

def initialize_session_state():
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "pipeline" not in st.session_state:
        st.session_state.pipeline = None

def initialize_pipeline():
    """Initialize the RAG pipeline if not already initialized"""
    if not st.session_state.pipeline:
        try:
            # Load knowledge base and create vector store
            kb_loader = KnowledgeBaseLoader("knowledge_base")
            documents = kb_loader.load_documents()
            vectorstore = kb_loader.create_vector_store(documents)
            
            # Initialize RAG pipeline
            pipeline = RAGPipeline(vectorstore)
            st.session_state.pipeline = pipeline
            return True
        except Exception as e:
            st.error(f"Error initializing pipeline: {str(e)}")
            return False
    return True

def chat_interface():
    st.title("PrepMitra")
    st.markdown("Your AI Study Assistant powered by RAG and Deepseek")
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Handle user input
    if prompt := st.chat_input("Ask about your study materials"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.chat_message("user"):
            st.markdown(prompt)
        
        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            
            with st.spinner("Analyzing your question..."):
                try:
                    if not st.session_state.pipeline:
                        if not initialize_pipeline():
                            return
                    
                    response = st.session_state.pipeline.process_query(prompt)
                    full_response = response["answer"]
                    
                    # Optionally display sources
                    if response.get("source_documents"):
                        full_response += "\n\nSources:\n"
                        for doc in response["source_documents"]:
                            full_response += f"- {doc.metadata.get('source', 'Unknown')}\n"
                            
                except Exception as e:
                    full_response = f"Error: {str(e)}"
            
            message_placeholder.markdown(full_response)
        
        st.session_state.messages.append({"role": "assistant", "content": full_response})

def main():
    initialize_session_state()
    
    # Initialize pipeline on startup
    if not st.session_state.pipeline:
        with st.spinner("Initializing knowledge base... This may take a moment."):
            initialize_pipeline()
    
    chat_interface()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main() 