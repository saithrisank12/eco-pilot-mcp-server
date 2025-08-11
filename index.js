import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BEARER_TOKEN = process.env.BEARER_TOKEN || "mcp123token";
const PHONE_NUMBER = process.env.PHONE_NUMBER || "918331990822";

// Health check route (so deployment platforms know app is alive)
app.get("/", (req, res) => {
  res.status(200).send("✅ Eco-Pilot MCP Server is running!");
});

// Authorization middleware
app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || authHeader !== `Bearer ${BEARER_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// MCP validation route — must return phone number in {country_code}{number} format
app.get("/validate", (req, res) => {
  res.json({ phone: PHONE_NUMBER });
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
