const { pickRandomPrompt } = require("../lib/prompts");
const { generateImage } = require("../lib/gemini");
const { sendJson, methodNotAllowed, readJsonBody } = require("../lib/http");

module.exports = async (req, res) => {
  if (req.method !== "POST") return methodNotAllowed(res);

  try {
    const body = await readJsonBody(req);
    let prompt = body?.prompt;
    let index = body?.index;

    if (!prompt) {
      const picked = pickRandomPrompt();
      prompt = picked.text;
      index = picked.index;
    }

    const image = await generateImage(prompt);

    sendJson(res, 200, {
      index,
      prompt,
      mimeType: image.mimeType,
      imageDataUrl: `data:${image.mimeType};base64,${image.base64}`,
    });
  } catch (err) {
    const status = err.status === 429 ? 429 : err.status || 500;
    sendJson(res, status, {
      error: err.message,
      hint:
        status === 429
          ? "Rate limit or daily quota reached. Wait a few minutes or enable billing in Google AI Studio."
          : undefined,
    });
  }
};
