const { loadPrompts, PROMPTS_FILE } = require("../lib/prompts");
const { getModel, hasApiKey } = require("../lib/gemini");
const { sendJson, methodNotAllowed } = require("../lib/http");

module.exports = async (req, res) => {
  if (req.method !== "GET") return methodNotAllowed(res);

  sendJson(res, 200, {
    ok: true,
    model: getModel(),
    promptsFile: PROMPTS_FILE,
    promptCount: loadPrompts().length,
    hasApiKey: hasApiKey(),
  });
};
