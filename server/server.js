require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const auth = require("./middleware/auth");
const { addClient, removeClient } = require("./sseManager");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/workspaces", require("./routes/workspaceRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/site", require("./routes/siteRoutes"));
app.use("/api/upload", require("./routes/uploadRoute"));

// SSE – real-time event stream for admin panel
app.get("/api/events", auth, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.write(`event: connected\ndata: {"ok":true}\n\n`);
  addClient(res);

  // Keep-alive heartbeat every 25 s
  const heartbeat = setInterval(() => {
    res.write(":heartbeat\n\n");
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    removeClient(res);
  });
});

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
