const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ----------------------
// TEST ROUTE
// ----------------------
app.get("/", (req, res) => {
    res.send("Server is running");
});

// ----------------------
// CHAT ROUTE
// ----------------------
app.post("/chat", async (req, res) => {
    try {
        const { message, intro, instruction } = req.body;

        if (!message) {
            return res.json({ reply: "No message received" });
        }

        const API_KEY = process.env.API_KEY;

        if (!API_KEY) {
            return res.json({ reply: "API key missing" });
        }

        // ----------------------
        // BUILD PROMPT (IMPORTANT FIX)
        // ----------------------
        const finalPrompt = `
Intro:
${intro || "No intro provided"}

Instruction:
${instruction || "Reply naturally and short"}

User message:
${message}
`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: finalPrompt }]
                    }
                ]
            }
        );

        const replyMessage =
            response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        return res.json({
            reply: replyMessage || "No response"
        });

    } catch (error) {
        console.log(error.response?.data || error.message);

        return res.status(500).json({
            reply: "Server error"
        });
    }
});

// ----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
