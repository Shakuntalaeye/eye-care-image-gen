const fs = require("fs");
const path = require("path");

const PROMPTS_FILE =
  process.env.PROMPTS_FILE || path.join(process.cwd(), "prompts.txt");

let cachedPrompts = null;

function loadPrompts() {
  if (cachedPrompts) return cachedPrompts;

  const raw = fs.readFileSync(PROMPTS_FILE, "utf8");
  const lines = raw.split(/\r?\n/);
  const prompts = [];
  let current = [];

  for (const line of lines) {
    if (/^\d+\.\s/.test(line.trim()) && current.length > 0) {
      prompts.push(current.join("\n").trim());
      current = [line.replace(/^\d+\.\s*/, "").trim()];
    } else if (/^\d+\.\s/.test(line.trim())) {
      current = [line.replace(/^\d+\.\s*/, "").trim()];
    } else if (line.trim() || current.length > 0) {
      current.push(line);
    }
  }

  if (current.length > 0) {
    prompts.push(current.join("\n").trim());
  }

  cachedPrompts = prompts.filter(Boolean);
  return cachedPrompts;
}

function pickRandomPrompt() {
  const prompts = loadPrompts();
  const index = Math.floor(Math.random() * prompts.length);
  return { index, text: prompts[index], total: prompts.length };
}

module.exports = { loadPrompts, pickRandomPrompt, PROMPTS_FILE };
