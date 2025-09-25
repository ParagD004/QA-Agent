import React, { useState, useRef, useEffect } from "react";



const Chatbot = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything about Insurellm.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, open]);

  // Always focus input after every message if chatbot is open
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, messages]);

  if (!open) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input, timestamp: new Date() };
    setMessages((msgs) => [...msgs, userMsg]);
    setIsLoading(true);

    console.log("Sending request to backend:", input);

    try {
      const requestBody = { question: input, session_id: "default" };
      console.log("Request body:", requestBody);

      const response = await fetch("https://qa-agent-om46.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      const botMsg = { from: "bot", text: data.answer, timestamp: new Date() };
      setMessages((msgs) => [...msgs, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      let errorMessage = "Sorry, there was an error. Please try again.";

      if (error.message.includes("Server error: 500")) {
        errorMessage = "The server is experiencing issues. Please try again in a moment.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      }

      setMessages((msgs) => [...msgs, { from: "bot", text: `${errorMessage} (Debug: ${error.message})`, timestamp: new Date() }]);
    } finally {
      setInput("");
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 112,
      right: 32,
      width: 340,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
      zIndex: 1001,
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ padding: "1rem", borderBottom: "1px solid #eee", background: "#3949ab", color: "#fff", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <span>Insurellm AI Chatbot</span>
        <button onClick={onClose} style={{ float: "right", background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>&times;</button>
      </div>
      <div style={{ flex: 1, padding: "1rem", maxHeight: 300, overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.from === "user" ? "right" : "left", margin: "0.5rem 0" }}>
            <div style={{
              display: "inline-block",
              background: msg.from === "user" ? "#e3e7fd" : "#f1f1f1",
              color: "#222",
              borderRadius: 8,
              padding: "0.5rem 1rem",
              maxWidth: "80%"
            }}>
              <div style={{ marginBottom: "0.25rem" }}>{msg.text}</div>
              <div style={{
                fontSize: "0.75rem",
                color: "#666",
                textAlign: msg.from === "user" ? "right" : "left"
              }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #eee", padding: "0.5rem" }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Type your question..."
          style={{ flex: 1, border: "1px solid #ccc", borderRadius: 6, padding: "0.5rem", color: "#111" }}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading} style={{ marginLeft: 8, background: "#3949ab", color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 1rem", cursor: isLoading ? "not-allowed" : "pointer" }}>
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
