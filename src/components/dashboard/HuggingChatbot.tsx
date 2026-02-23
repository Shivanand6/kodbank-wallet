import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const HuggingChatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage: Message = { role: "user", content: message };
    const updatedChat = [...chat, userMessage];
    setChat(updatedChat);
    setMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("kodbot-chat", {
        body: {
          message,
          history: updatedChat.slice(-10),
        },
      });

      if (error) throw error;

      setChat((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "No response." },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again. 🔧" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">KodBot AI 🤖</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Your multilingual banking assistant — ask about spending, savings, UPI, and more!
      </p>

      <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-card space-y-3">
        {chat.length === 0 && (
          <p className="text-muted-foreground text-center mt-16">
            Start a conversation with KodBot! 💬
          </p>
        )}
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2 text-sm text-muted-foreground">
              KodBot is typing...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border rounded-lg px-4 py-2 bg-background text-foreground"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-primary text-primary-foreground px-5 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default HuggingChatbot;
