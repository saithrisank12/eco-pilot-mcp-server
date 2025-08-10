import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BEARER_TOKEN = process.env.BEARER_TOKEN || "mcp123token";

app.use(express.json());

// Middleware for Bearer token authentication
app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || authHeader !== `Bearer ${BEARER_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// Validate tool required by Puch AI
app.post("/validate", (req, res) => {
  return res.json({ phone: process.env.PHONE_NUMBER || "918331990822" });
});

// Main tool endpoint to handle different tools
app.post("/call-tool", (req, res) => {
  const { toolName, params } = req.body;

  if (!toolName) {
    return res.status(400).json({ error: "toolName is required" });
  }

  // Send Message Tool
  if (toolName === "sendMessage") {
    const { phone, message } = params;
    if (!phone || !message) {
      return res.status(400).json({ error: "Phone and message are required" });
    }
    return res.json({
      status: "success",
      sentTo: phone,
      content: message
    });
  }

  // Quiz Tool
  if (toolName === "quiz") {
    return res.json({
      questions: [
        {
          id: 1,
          question: "How often do you shop online?",
          options: ["Never", "Monthly", "Weekly", "Almost daily"]
        },
        {
          id: 2,
          question: "What’s your top spending category?",
          options: ["Fashion", "Electronics", "Groceries", "Others"]
        },
        {
          id: 3,
          question: "Which platform do you use most?",
          options: ["Amazon", "Flipkart", "Myntra", "Ajio", "Others"]
        }
      ]
    });
  }

  // Carbon Footprint Tool
  if (toolName === "carbonFootprint") {
    const { answers } = params;
    if (!answers || !Array.isArray(answers) || answers.length !== 3) {
      return res.status(400).json({ error: "Invalid answers format" });
    }

    let score = 0;
    const freqMap = { "Never": 0, "Monthly": 1, "Weekly": 3, "Almost daily": 5 };
    score += freqMap[answers[0]] || 0;

    const catMap = { "Fashion": 3, "Electronics": 4, "Groceries": 1, "Others": 2 };
    score += catMap[answers[1]] || 2;

    const platformMap = { "Amazon": 3, "Flipkart": 2, "Myntra": 2, "Ajio": 1, "Others": 1 };
    score += platformMap[answers[2]] || 1;

    const footprint = score * 0.4;

    return res.json({
      footprint: footprint.toFixed(2),
      message: `Your estimated carbon footprint is ${footprint.toFixed(2)} metric tons per year.`
    });
  }

  // Product Scan Tool (FIXED)
  if (toolName === "productScan") {
    const { productLink } = params;
    if (!productLink) {
      return res.status(400).json({ error: "Product link is required" });
    }
    return res.json({
      productLink,
      ecoScore: Math.floor(Math.random() * 100) + 1,
      message: "Eco score calculated based on sample data."
    });
  }

  // If tool not found
  return res.status(400).json({ error: "Unknown toolName" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
