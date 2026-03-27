const express = require("express");
const app = express();

// Middleware to read JSON from Android app
app.use(express.json());

// ----------------------
// Root route (browser test)
// ----------------------
app.get("/", (req, res) => {
    res.send("Server is running");
});

// ----------------------
// Chat API route (Android will call this)
// ----------------------
app.post("/chat", (req, res) => {

    // Get message sent from Android
    const userMessage = req.body.message;

    console.log("Message received from app:", userMessage);

    // Basic reply logic (you can replace with AI later)
    let replyMessage = "";

    if (!userMessage) {
        replyMessage = "No message received";
    } else {
        replyMessage = "Bot reply: " + userMessage;
    }

    // Send response back to Android
    res.json({
        reply: replyMessage
    });
});

// ----------------------
// Server start (IMPORTANT for Render)
// ----------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
