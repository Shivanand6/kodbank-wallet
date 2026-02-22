export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: message,
        }),
      }
    );

    const data = await response.json();

    let botReply = "No response from AI.";

    if (Array.isArray(data) && data[0]?.generated_text) {
      botReply = data[0].generated_text;
    } else if (data.generated_text) {
      botReply = data.generated_text;
    } else if (data.error) {
      botReply = "Model is loading... please wait a few seconds.";
    }

    return res.status(200).json({ reply: botReply });

  } catch (error) {
    return res.status(500).json({ reply: "Server error connecting to AI." });
  }
}
