const promptText = document.getElementById("prompt-text");
const promptMeta = document.getElementById("prompt-meta");
const imageStage = document.getElementById("image-stage");
const errorBox = document.getElementById("error-box");
const statusPill = document.getElementById("status-pill");
const btnGenerate = document.getElementById("btn-generate");
const btnRandomPrompt = document.getElementById("btn-random-prompt");
const btnDownload = document.getElementById("btn-download");

let currentPrompt = "";
let currentIndex = null;

async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    if (data.ok) {
      statusPill.textContent = `${data.promptCount} prompts · ${data.model}`;
      statusPill.classList.add("ok");
    } else {
      throw new Error("Server not ready");
    }
  } catch {
    statusPill.textContent = "Server offline";
    statusPill.classList.add("err");
  }
}

function showError(message, hint) {
  errorBox.textContent = hint ? `${message}\n\n${hint}` : message;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.classList.add("hidden");
  errorBox.textContent = "";
}

async function loadRandomPrompt() {
  clearError();
  promptText.textContent = "Loading…";
  btnRandomPrompt.disabled = true;

  try {
    const res = await fetch("/api/prompts/random");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load prompt");

    currentPrompt = data.prompt;
    currentIndex = data.index;
    promptMeta.textContent = `Prompt ${data.index + 1} of ${data.total}`;
    promptText.textContent = data.prompt;
  } catch (err) {
    promptText.textContent = "Could not load prompt.";
    showError(err.message);
  } finally {
    btnRandomPrompt.disabled = false;
  }
}

function setLoading(loading) {
  btnGenerate.disabled = loading;
  btnRandomPrompt.disabled = loading;
  imageStage.classList.toggle("loading", loading);
  btnGenerate.textContent = loading ? "Generating…" : "Generate image";
}

async function generateImage() {
  clearError();
  setLoading(true);
  btnDownload.classList.add("hidden");

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: currentPrompt,
        index: currentIndex,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw Object.assign(new Error(data.error || "Generation failed"), {
        hint: data.hint,
      });
    }

    currentPrompt = data.prompt;
    currentIndex = data.index;
    promptMeta.textContent =
      data.index != null ? `Prompt ${data.index + 1}` : "Custom prompt";
    promptText.textContent = data.prompt;

    imageStage.innerHTML = "";
    const img = document.createElement("img");
    img.alt = "Generated eye care social ad";
    img.src = data.imageDataUrl;
    imageStage.appendChild(img);

    btnDownload.href = data.imageDataUrl;
    btnDownload.download = `eye-care-ad-${(data.index ?? 0) + 1}.png`;
    btnDownload.classList.remove("hidden");
  } catch (err) {
    showError(err.message, err.hint);
    if (!imageStage.querySelector("img")) {
      imageStage.innerHTML = `
        <div class="placeholder">
          <p>Generation failed. Try again or shuffle the prompt.</p>
        </div>`;
    }
  } finally {
    setLoading(false);
  }
}

btnGenerate.addEventListener("click", generateImage);
btnRandomPrompt.addEventListener("click", loadRandomPrompt);

checkHealth();
loadRandomPrompt();
