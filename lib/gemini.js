const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-image";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

async function generateImage(prompt) {
  if (!API_KEY) {
    const err = new Error(
      "Missing GEMINI_API_KEY. Set it in .env locally or in Vercel project settings."
    );
    err.status = 500;
    throw err;
  }

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["IMAGE"] },
  };

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message || `Gemini API error (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  const parts = data?.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return {
        mimeType: part.inlineData.mimeType || "image/png",
        base64: part.inlineData.data,
      };
    }
  }

  const textPart = parts.find((p) => p.text)?.text;
  throw new Error(
    textPart || "No image returned. The model may have refused this prompt."
  );
}

function getModel() {
  return MODEL;
}

function hasApiKey() {
  return Boolean(API_KEY);
}

module.exports = { generateImage, getModel, hasApiKey };
