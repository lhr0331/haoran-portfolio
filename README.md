# Haoran Li Portfolio

Interactive 3D photography portfolio built as a static website.

## Local Preview

```bash
node local-server.cjs
```

Then open:

```text
http://127.0.0.1:5174/index.html
```

## GitHub Pages

This folder is ready for GitHub Pages. It does not require a build step.

Recommended Pages setting:

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/root`

## Structure

- `index.html` - page markup
- `style.css` - visual styling
- `script.js` - Three.js gallery and transitions
- `sound.js` - local audio playback
- `images/` - portfolio image assets
- `music/portfolio-track.mp3` - compressed local music
- `vendor/three.module.min.js` - local Three.js runtime for static hosting
