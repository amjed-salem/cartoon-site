const imageUpload = document.getElementById("imageUpload");
const originalImg = document.getElementById("originalImg");
const cartoonImg = document.getElementById("cartoonImg");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const originalFrame = document.getElementById("originalFrame");
const cartoonFrame = document.getElementById("cartoonFrame");
const statusMessage = document.getElementById("statusMessage");

let cartoonDataUrl = "";

imageUpload.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setStatus("Please choose a valid image file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const sourceUrl = reader.result;
    if (typeof sourceUrl !== "string") {
      setStatus("Unable to read this image file.");
      return;
    }

    originalImg.src = sourceUrl;
    originalImg.hidden = false;
    restoreImagePlaceholder(originalFrame);

    setStatus("Generating cartoon preview...");
    generateCartoonPreview(sourceUrl);
  };
  reader.onerror = () => setStatus("File read failed. Please try another image.");

  reader.readAsDataURL(file);
});

downloadBtn.addEventListener("click", () => {
  if (!cartoonDataUrl) return;

  const a = document.createElement("a");
  a.href = cartoonDataUrl;
  a.download = "cartoon-image-demo.png";
  a.click();
});

resetBtn.addEventListener("click", () => {
  imageUpload.value = "";
  originalImg.hidden = true;
  originalImg.removeAttribute("src");
  cartoonImg.hidden = true;
  cartoonImg.removeAttribute("src");
  cartoonDataUrl = "";
  downloadBtn.disabled = true;
  resetBtn.disabled = true;
  restoreImagePlaceholder(originalFrame, "Your uploaded image appears here.");
  restoreImagePlaceholder(cartoonFrame, "Cartoon preview appears here.");
  setStatus("Upload a JPG or PNG file to begin.");
});

function generateCartoonPreview(sourceUrl) {
  const img = new Image();

  img.onload = () => {
    const maxSize = 1200;
    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
    const width = Math.floor(img.width * scale);
    const height = Math.floor(img.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      setStatus("Canvas is not available in this browser.");
      return;
    }

    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = quantize(data[i], 32);
      data[i + 1] = quantize(data[i + 1], 32);
      data[i + 2] = quantize(data[i + 2], 32);

      data[i] = Math.min(255, data[i] * 1.05);
      data[i + 1] = Math.min(255, data[i + 1] * 1.04);
      data[i + 2] = Math.min(255, data[i + 2] * 1.03);
    }

    const edges = detectEdges(data, width, height);
    for (let i = 0; i < data.length; i += 4) {
      if (edges[i / 4] > 55) {
        data[i] *= 0.22;
        data[i + 1] *= 0.22;
        data[i + 2] *= 0.22;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    cartoonDataUrl = canvas.toDataURL("image/png");

    cartoonImg.src = cartoonDataUrl;
    cartoonImg.hidden = false;
    restoreImagePlaceholder(cartoonFrame);

    downloadBtn.disabled = false;
    resetBtn.disabled = false;
    setStatus("Done! You can now download the cartoon image.");
  };

  img.onerror = () => setStatus("Could not load image data.");
  img.src = sourceUrl;
}

function quantize(value, step) {
  return Math.min(255, Math.floor(value / step) * step + step / 2);
}

function detectEdges(data, width, height) {
  const gray = new Uint8Array(width * height);
  for (let i = 0, j = 0; i < data.length; i += 4, j += 1) {
    gray[j] = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) | 0;
  }

  const out = new Uint8Array(width * height);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const idx = y * width + x;
      const gx =
        -gray[idx - width - 1] -
        2 * gray[idx - 1] -
        gray[idx + width - 1] +
        gray[idx - width + 1] +
        2 * gray[idx + 1] +
        gray[idx + width + 1];
      const gy =
        -gray[idx - width - 1] -
        2 * gray[idx - width] -
        gray[idx - width + 1] +
        gray[idx + width - 1] +
        2 * gray[idx + width] +
        gray[idx + width + 1];
      out[idx] = Math.min(255, Math.sqrt(gx * gx + gy * gy));
    }
  }

  return out;
}

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
