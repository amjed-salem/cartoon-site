# Cartoonify Website (AI API)

A frontend-only website where users upload a photo and convert it into a cartoon-style image using a **real AI API** (DeepAI Toonify).

## Features

- Clean, modern design
- Image upload button
- Original and cartoon image shown side by side
- Download button for the final cartoon image
- Reset button for quick retries
- Real AI API integration (no local demo filter)

## Setup instructions

### 1) Get a free API key

1. Create an account at [DeepAI](https://deepai.org/).
2. Open your account/API page and copy your API key.

### 2) Add your API key

Edit `config.js` and set your key:

```js
window.APP_CONFIG = {
  DEEPAI_API_KEY: "YOUR_DEEPAI_API_KEY_HERE"
};
```

> `config.js` is loaded in the browser, so this is fine for local demos only.
> For production, put API calls behind a backend proxy so the key is not exposed.

## Run locally

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2 (recommended): Run a local static server

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000`

## Project files

- `index.html` – app layout and controls
- `styles.css` – modern responsive styling
- `script.js` – upload flow + DeepAI API request + download logic
- `config.js` – local API key configuration
