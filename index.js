import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BEARER_TOKEN = process.env.BEARER_TOKEN || "mcp123token";

app.use(express.json());

// Health check route (so deployment platforms know app is alive)
app.get("/", (req, res) => {
  res.status(200).send("✅ Eco-Pilot MCP Server is running!");
});

// Verification middleware
app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || authHeader !== `Bearer ${BEARER_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// Example protected route
app.post("/process", (req, res) => {
  try {
    const data = req.body;
    res.json({
      message: "Data processed successfully!",
      received: data,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
