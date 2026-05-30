const { pickRandomPrompt } = require("../../lib/prompts");
const { sendJson, methodNotAllowed } = require("../../lib/http");

module.exports = async (req, res) => {
  if (req.method !== "GET") return methodNotAllowed(res);

  try {
    const picked = pickRandomPrompt();
    sendJson(res, 200, {
      index: picked.index,
      total: picked.total,
      prompt: picked.text,
    });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
};
