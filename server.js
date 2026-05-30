require("dotenv").config();
const express = require("express");
const path = require("path");
const healthHandler = require("./api/health");
const randomHandler = require("./api/prompts/random");
const generateHandler = require("./api/generate");

const app = express();
const PORT = Number(process.env.PORT) || 3847;

function wrap(handler) {
  return (req, res) => handler(req, res);
}

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", wrap(healthHandler));
app.get("/api/prompts/random", wrap(randomHandler));
app.post("/api/generate", wrap(generateHandler));

app.listen(PORT, () => {
  const { loadPrompts, PROMPTS_FILE } = require("./lib/prompts");
  const { getModel } = require("./lib/gemini");
  console.log(`Eye Care Image Generator running at http://localhost:${PORT}`);
  console.log(`Model: ${getModel()}`);
  console.log(`Prompts: ${PROMPTS_FILE} (${loadPrompts().length} loaded)`);
});
