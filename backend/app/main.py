# backend/app/main.py
import os
import glob
import json
from typing import List, Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import math

# Initialize FastAPI app
app = FastAPI(title="Company RAG API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # local dev
        "https://qaagent.vercel.app",  # correct deployed frontend URL
        "https://qaagent-dvyayri1m-parag-dharmiks-projects.vercel.app",  # old URL (keep for safety)
        "*"  # Allow all origins for now - you can restrict this later
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv(override=True)

# Initialize OpenAI client
client = openai.OpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

# Global variables
MODEL = "gpt-4o-mini"
EMBEDDING_MODEL = "text-embedding-3-small"
documents = []
embeddings = []
# In-memory chat history per session
session_histories = {}

# Pydantic models for request/response
class ChatRequest(BaseModel):
    question: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    answer: str

# Helper functions
def load_documents():
    """Load and chunk documents from knowledge base"""
    global documents
    
    folders = glob.glob("knowledge-base/*")
    documents = []
    
    for folder in folders:
        doc_type = os.path.basename(folder)
        md_files = glob.glob(os.path.join(folder, "**/*.md"), recursive=True)
        
        for file_path in md_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Simple text chunking
                chunks = split_text(content, chunk_size=1000, overlap=200)
                for i, chunk in enumerate(chunks):
                    documents.append({
                        "content": chunk,
                        "metadata": {
                            "doc_type": doc_type,
                            "file_path": file_path,
                            "chunk_id": i
                        }
                    })
            except Exception as e:
                print(f"Error loading {file_path}: {e}")

def split_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """Simple text splitter"""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
        
    return chunks

def get_embedding(text: str) -> List[float]:
    """Get embedding for text using OpenAI API"""
    try:
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error getting embedding: {e}")
        return []

def create_embeddings():
    """Create embeddings for all documents"""
    global embeddings
    embeddings = []
    
    for doc in documents:
        embedding = get_embedding(doc["content"])
        if embedding:
            embeddings.append(embedding)
        else:
            embeddings.append([0] * 1536)  # Default embedding size

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        return 0.0
    
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    magnitude1 = math.sqrt(sum(a * a for a in vec1))
    magnitude2 = math.sqrt(sum(a * a for a in vec2))
    
    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0
    
    return dot_product / (magnitude1 * magnitude2)

def search_similar_documents(query: str, k: int = 5) -> List[Dict[str, Any]]:
    """Search for similar documents using cosine similarity"""
    if not embeddings or not documents:
        return []
    
    query_embedding = get_embedding(query)
    if not query_embedding:
        return []
    
    # Calculate similarities
    similarities = []
    for doc_embedding in embeddings:
        similarity = cosine_similarity(query_embedding, doc_embedding)
        similarities.append(similarity)
    
    # Get top k similar documents
    indexed_similarities = [(i, sim) for i, sim in enumerate(similarities)]
    indexed_similarities.sort(key=lambda x: x[1], reverse=True)
    
    results = []
    for idx, similarity in indexed_similarities[:k]:
        if similarity > 0.1:  # Minimum similarity threshold
            results.append({
                "content": documents[idx]["content"],
                "metadata": documents[idx]["metadata"],
                "similarity": similarity
            })
    
    return results

def generate_response(question: str, context_docs: List[Dict], chat_history: List) -> str:
    """Generate response using OpenAI API with context"""
    try:
        # Prepare context from retrieved documents
        context = "\n\n".join([doc["content"] for doc in context_docs])
        
        # Prepare chat history
        messages = [
            {
                "role": "system", 
                "content": f"""You are a helpful assistant that answers questions based on the provided context. 
                Use the context below to answer questions accurately. If the answer is not in the context, 
                say so politely and try to provide a helpful general response.
                
                Context:
                {context}"""
            }
        ]
        
        # Add chat history
        for role, content in chat_history[-10:]:  # Last 10 exchanges
            if role == "user":
                messages.append({"role": "user", "content": content})
            else:
                messages.append({"role": "assistant", "content": content})
        
        # Add current question
        messages.append({"role": "user", "content": question})
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"Error generating response: {e}")
        return "I apologize, but I'm having trouble generating a response right now."

# Initialize the RAG system
def initialize_rag():
    """Initialize the RAG system"""
    print("Loading documents...")
    load_documents()
    print(f"Loaded {len(documents)} document chunks")
    
    print("Creating embeddings...")
    create_embeddings()
    print("RAG system initialized successfully")

# Initialize on startup
@app.on_event("startup")
async def startup_event():
    initialize_rag()

# API endpoints
@app.get("/")
async def root():
    return {"message": "Company RAG API is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Track chat history per session
        session_id = request.session_id or "default"
        if session_id not in session_histories:
            session_histories[session_id] = []
        chat_history = session_histories[session_id]

        # Search for relevant documents
        context_docs = search_similar_documents(request.question, k=5)
        
        # Generate response using context and chat history
        answer = generate_response(request.question, context_docs, chat_history)

        # Update chat history with user question and AI answer
        chat_history.append(("user", request.question))
        chat_history.append(("ai", answer))

        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}