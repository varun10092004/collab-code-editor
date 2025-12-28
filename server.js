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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.post("/ai-suggest", async (req, res) => {
  try {
    const { code } = req.body;
    const suggestion = await getAISuggestion(code);
    res.json({ suggestion });
  } catch (error) {
    res.status(500).json({ error: "AI failed" });
  }
});


const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

socketHandler(io);

server.listen(5000, () =>
  console.log("Server running on port 5000")
);
