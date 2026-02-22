import React, { useState } from "react";

const HuggingChatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const API_URL =
    "https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0";

  const API_KEY = "import React, { useState } from "react";

const HuggingChatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const API_URL =
    "https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0";

  const API_KEY = "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";

  const sendMessage = async () => {
    if (!message) return;

    const userMessage = { sender: "You", text: message };
    setChat([...chat, userMessage]);

    setMessage("");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: message,
      }),
    });

    const data = await response.json();

    const botReply = {
      sender: "Bot",
      text: data.generated_text || "Sorry, no response",
    };

    setChat((prev) => [...prev, botReply]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Wallet Assistant</h2>

      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "70%", padding: "10px" }}
      />
      <button onClick={sendMessage} style={{ padding: "10px" }}>
        Send
      </button>
    </div>
  );
};

export default HuggingChatbot;";

  const sendMessage = async () => {
    if (!message) return;

    const userMessage = { sender: "You", text: message };
    setChat([...chat, userMessage]);

    setMessage("");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: message,
      }),
    });

    const data = await response.json();

    const botReply = {
      sender: "Bot",
      text: data.generated_text || "Sorry, no response",
    };

    setChat((prev) => [...prev, botReply]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Wallet Assistant</h2>

      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "70%", padding: "10px" }}
      />
      <button onClick={sendMessage} style={{ padding: "10px" }}>
        Send
      </button>
    </div>
  );
};

export default HuggingChatbot;
