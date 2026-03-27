const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// ----------------------
// CHAT ROUTE
// ----------------------
app.post("/chat", async (req, res) => {

    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.json({ reply: "No message received" });
        }

        // 🔑 Your environment API key
        const API_KEY = process.env.API_KEY;

        if (!API_KEY) {
            return res.json({ reply: "API key not found in environment" });
        }

        // 🔥 Gemini API call
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: userMessage
                            }
                        ]
                    }
                ]
            }
        );

        const replyMessage =
            response.data.candidates[0].content.parts[0].text;

        res.json({
            reply: replyMessage
        });

    } catch (error) {
        console.log("Error:", error.message);

        res.json({
            reply: "AI request failed"
        });
    }
});

// ----------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
