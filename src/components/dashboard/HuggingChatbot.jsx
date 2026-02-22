import React, { useState } from "react";

const HuggingChatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "You", text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      const botMessage = {
        sender: "Bot",
        text: data.reply,
      };

      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { sender: "Bot", text: "Error connecting to AI." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", marginTop: "40px" }}>
      <h2>Wallet AI Assistant</h2>

      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
        {loading && <div>Bot is typing...</div>}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "70%", padding: "10px" }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button onClick={sendMessage} style={{ padding: "10px" }}>
        Send
      </button>
    </div>
  );
};

export default HuggingChatbot;
