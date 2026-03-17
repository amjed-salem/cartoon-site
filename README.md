# Cartoonify Demo Website

A simple **frontend-only** website where users can upload a photo and get a cartoon-style demo output directly in the browser.

## Features

- Clean, modern design
- Image upload button
- Original and cartoon image shown side by side
- Download button for the final cartoon image
- Reset button to quickly test another photo
- No backend required (pure HTML/CSS/JS)

## Quick start

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2 (recommended): Run a local static server

```bash
python3 -m http.server 8000
```

Then visit:

- `http://localhost:8000`

## Project files

- `index.html` – app layout and controls
- `styles.css` – modern responsive styling
- `script.js` – upload handling, demo cartoon effect, and download logic

## Notes

- The cartoon output is a demo effect built with client-side canvas processing:
  - color quantization
  - edge detection + dark edge blending
- This is a starter frontend. You can later replace the demo transformation with a real ML cartoonization API or backend.
