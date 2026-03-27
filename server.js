const express = require("express");

const app = express();
app.use(express.json());

// API key from Render environment
const API_KEY = process.env.API_KEY;

// Test route (very important)
app.post("/chat", (req, res) => {
    const userMessage = req.body.message;

    console.log("Received:", userMessage);

    res.json({
        reply: "Hello from backend: " + userMessage
    });
});

// Chat endpoint
app.post("/chat", async (req, res) => {

    const userMessage = req.body.message;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + API_KEY,
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
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0].text
            ? data.candidates[0].content.parts[0].text
            : "No reply";

        res.json({ reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Server error" });
    }
});

// Render dynamic port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

