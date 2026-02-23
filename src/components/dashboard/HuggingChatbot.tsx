import { useState } from "react";

const HuggingChatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
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

      setChat((prev) => [
        ...prev,
        { sender: "Bot", text: data.reply },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { sender: "Bot", text: "Error connecting to AI." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">KodBot AI</h2>

      <div className="h-80 overflow-y-auto border rounded-lg p-3 mb-4 bg-card">
        {chat.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
        {loading && <div>Bot is typing...</div>}
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border rounded px-3 py-2"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default HuggingChatbot;
