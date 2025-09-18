import React, { useState } from "react";
import ChatIcon from "./ChatIcon";
import Chatbot from "./Chatbot";


const ChatbotWidget = ({ open, setOpen }) => {
  return (
    <>
      <ChatIcon onClick={() => setOpen(true)} />
      <Chatbot open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ChatbotWidget;
