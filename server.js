const express = require("express");

const app = express();
app.use(express.json());

// 🔴 Put your NEW private Gemini API key here
const API_KEY = process.env.API_KEY;

// Health check (important for Render)
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Chat endpoint
app.post("/chat", async (req, res) => {

    const userMessage = req.body.message;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: userMessage }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";

        res.json({ reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Server error" });
    }
});

// Render requires PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
