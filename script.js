const imageUpload = document.getElementById("imageUpload");
const originalImg = document.getElementById("originalImg");
const cartoonImg = document.getElementById("cartoonImg");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const originalFrame = document.getElementById("originalFrame");
const cartoonFrame = document.getElementById("cartoonFrame");
const statusMessage = document.getElementById("statusMessage");

const deepAiKey = window.APP_CONFIG?.DEEPAI_API_KEY || "";
let selectedFile = null;
let cartoonImageUrl = "";

if (!deepAiKey) {
  setStatus("Missing API key. Add DEEPAI_API_KEY in config.js to continue.");
}

imageUpload.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setStatus("Please choose a valid image file.");
    return;
  }

  selectedFile = file;
  cartoonImageUrl = "";
  cartoonImg.hidden = true;
  cartoonImg.removeAttribute("src");
  restoreImagePlaceholder(cartoonFrame, "AI cartoon result appears here.");
  downloadBtn.disabled = true;
  resetBtn.disabled = false;

  const sourceUrl = URL.createObjectURL(file);
  originalImg.src = sourceUrl;
  originalImg.hidden = false;
  restoreImagePlaceholder(originalFrame);

  generateBtn.disabled = !deepAiKey;
  setStatus(deepAiKey ? "Image ready. Click Generate Cartoon." : "Add API key in config.js first.");
});

generateBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    setStatus("Upload an image first.");
    return;
  }

  if (!deepAiKey) {
    setStatus("Missing API key. Add DEEPAI_API_KEY in config.js.");
    return;
  }

  generateBtn.disabled = true;
  setStatus("Generating cartoon via DeepAI API...");

  try {
    const form = new FormData();
    form.append("image", selectedFile);

    const response = await fetch("https://api.deepai.org/api/toonify", {
      method: "POST",
      headers: {
        "api-key": deepAiKey
      },
      body: form
    });

    const data = await response.json();

    if (!response.ok || !data.output_url) {
      const msg = data.err || "AI API request failed.";
      throw new Error(msg);
    }

    cartoonImageUrl = data.output_url;
    cartoonImg.src = cartoonImageUrl;
    cartoonImg.hidden = false;
    restoreImagePlaceholder(cartoonFrame);

    downloadBtn.disabled = false;
    setStatus("Done! Cartoon generated with DeepAI.");
  } catch (error) {
    setStatus(`Generation failed: ${error.message}`);
  } finally {
    generateBtn.disabled = false;
  }
});

downloadBtn.addEventListener("click", async () => {
  if (!cartoonImageUrl) return;

  try {
    const response = await fetch(cartoonImageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "cartoon-image-ai.png";
    a.click();

    URL.revokeObjectURL(blobUrl);
  } catch (_error) {
    setStatus("Download failed. Try opening the image in a new tab and save manually.");
  }
});

resetBtn.addEventListener("click", () => {
  imageUpload.value = "";
  selectedFile = null;
  cartoonImageUrl = "";

  originalImg.hidden = true;
  originalImg.removeAttribute("src");
  cartoonImg.hidden = true;
  cartoonImg.removeAttribute("src");

  generateBtn.disabled = true;
  downloadBtn.disabled = true;
  resetBtn.disabled = true;

  restoreImagePlaceholder(originalFrame, "Your uploaded image appears here.");
  restoreImagePlaceholder(cartoonFrame, "AI cartoon result appears here.");

  setStatus("Upload a JPG or PNG file to begin.");
});

function setStatus(message) {
  statusMessage.textContent = message;
}

function restoreImagePlaceholder(frame, customText) {
  const placeholder = frame.querySelector(".placeholder");
  if (!placeholder) {
    const p = document.createElement("p");
    p.className = "placeholder";
    p.textContent = customText || "";
    frame.appendChild(p);
  } else if (customText) {
    placeholder.textContent = customText;
  }

  const activePlaceholder = frame.querySelector(".placeholder");
  if (activePlaceholder && frame.querySelector("img:not([hidden])")) {
    activePlaceholder.remove();
  }
}
