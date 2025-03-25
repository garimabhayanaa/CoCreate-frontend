import React, { useState, useEffect, useRef } from "react";
import "../stylesheets/Chat.css";

const Chat = ({ documentId, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/chat/${documentId}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      documentId,
      sender: user.uid,
      senderEmail: user.email,
      message: newMessage,
      mentions: newMessage.match(/@\S+/g) || [],
    };

    try {
      const response = await fetch("http://localhost:5001/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      const savedMessage = await response.json();

      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    // Highlight mentions
    return text.replace(/@(\S+)/g, '<span class="chat-mention">@$1</span>');
  };

  return (
    <div className="chat-container">
      <h3 className="chat-title">Chat</h3>
      <div className="chat-messages">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chat-message ${msg.sender === user.uid ? 'chat-message-self' : 'chat-message-other'}`}
            >
              <div className="chat-message-sender">{msg.senderEmail}</div>
              <p 
                className="chat-message-content" 
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.message) }}
              ></p>
            </div>
          ))
        ) : (
          <p className="chat-empty">No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message... (@ to mention)"
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-send-btn">Send</button>
      </div>
    </div>
  );
};

export default Chat;