require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const socketHandler = require("./socket");
const getAISuggestion = require("./ai");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // STOP server if DB fails
  });

// AI Route
app.post("/ai-suggest", async (req, res) => {
  try {
    const { code } = req.body;
    const suggestion = await getAISuggestion(code);
    res.json({ suggestion });
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ error: "AI request failed" });
  }
});

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

socketHandler(io);

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
