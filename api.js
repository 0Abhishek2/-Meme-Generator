export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: `Write a short funny meme caption with emojis based on: "${prompt}"`
          }],
          temperature: 0.8
        })
      });
  
      const data = await response.json();
  
      const caption = data?.choices?.[0]?.message?.content || "😂 Can't think of anything!";
      res.status(200).json({ caption: caption.trim() });
  
    } catch (err) {
      console.error("API error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  