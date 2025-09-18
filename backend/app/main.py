# backend/app/main.py
import os
import glob
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

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
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')


# Global variables
MODEL = "gpt-4o-mini"
db_name = "vector_db"
vectorstore = None
conversation_chain = None
# In-memory chat history per session
session_histories = {}

# Pydantic models for request/response
class ChatRequest(BaseModel):
    question: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    answer: str

# Initialize the RAG system
def initialize_rag():
    global vectorstore, conversation_chain
    
    # Read in documents
    folders = glob.glob("knowledge-base/*")
    
    def add_metadata(doc, doc_type):
        doc.metadata["doc_type"] = doc_type
        return doc

    text_loader_kwargs = {'encoding': 'utf-8'}
    
    documents = []
    for folder in folders:
        doc_type = os.path.basename(folder)
        loader = DirectoryLoader(folder, glob="**/*.md", loader_cls=TextLoader, loader_kwargs=text_loader_kwargs)
        folder_docs = loader.load()
        documents.extend([add_metadata(doc, doc_type) for doc in folder_docs])

    # Split documents into chunks
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)

    # Create embeddings and vector store
    embeddings = OpenAIEmbeddings()
    
    # Create vectorstore using FAISS (no persistence needed for deployment)
    vectorstore = FAISS.from_documents(
        documents=chunks, 
        embedding=embeddings
    )
    
    # Create conversation chain
    llm = ChatOpenAI(temperature=0.7, model_name=MODEL)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 25})
    
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm, 
        retriever=retriever, 
        memory=ConversationBufferMemory(memory_key='chat_history', return_messages=True)
    )

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

        # Prepare input for the chain
        chain_input = {"question": request.question, "chat_history": chat_history}
        result = conversation_chain.invoke(chain_input)
        answer = result["answer"]

        # Update chat history with user question and LLM answer
        chat_history.append(("user", request.question))
        chat_history.append(("ai", answer))

        # If the answer is a fallback (e.g., "I don't know"), ask the LLM directly with history
        if answer.strip().lower() in ["i don't know", "i do not know", "sorry, i don't know", "no relevant information found."]:
            llm = ChatOpenAI(temperature=0.7, model_name=MODEL)
            # Format history for LLM: list of dicts/messages
            messages = []
            for role, content in chat_history[:-2]:  # Exclude the last fallback answer
                if role == "user":
                    messages.append({"role": "user", "content": content})
                else:
                    messages.append({"role": "assistant", "content": content})
            # Add the latest user question
            messages.append({"role": "user", "content": request.question})
            direct_answer = llm.invoke(messages)
            if isinstance(direct_answer, dict) and "content" in direct_answer:
                answer = direct_answer["content"]
            else:
                answer = str(direct_answer)
            # Update history with new answer
            chat_history[-1] = ("ai", answer)
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}