import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔥 Hugging Face Model URL
const HF_URL =
  "https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0";

// 🔐 Chat Endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required." });
  }

  try {
    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: message,
      }),
    });

    const data = await response.json();

    let botReply = "No response from AI.";

    if (Array.isArray(data) && data[0]?.generated_text) {
      botReply = data[0].generated_text;
    } else if (data.generated_text) {
      botReply = data.generated_text;
    } else if (data.error) {
      botReply = "Model is loading... please wait a few seconds.";
    }

    res.json({ reply: botReply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error connecting to AI." });
  }
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
