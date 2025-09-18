import React from "react";

const ChatIcon = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Chat with AI bot"
    style={{
      position: "fixed",
      bottom: 32,
      right: 32,
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: "#3949ab",
      color: "#fff",
      border: "none",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      cursor: "pointer",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 32
    }}
  >
    💬
  </button>
);

export default ChatIcon;
