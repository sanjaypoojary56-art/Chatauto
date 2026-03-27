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
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.json({ reply: "No message received" });
        }

        const API_KEY = process.env.API_KEY;

        if (!API_KEY) {
            return res.json({ reply: "API key missing in Render environment" });
        }

        // ----------------------
        // GEMINI 2.5 FLASH CALL (FIXED)
        // ----------------------
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
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
            response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        return res.json({
            reply: replyMessage || "No response from AI"
        });

    } catch (error) {
        console.log("FULL ERROR:");
        console.log(error.response?.data || error.message);

        return res.status(500).json({
            reply: error.response?.data || error.message
        });
    }
});

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
