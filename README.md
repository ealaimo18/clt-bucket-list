# Charlotte Bucket List 🌿

A personal bucket list tracker for Charlotte, NC adventures.

## Features
- 83 activities organized into 9 categories
- Mark items as visited — progress saves automatically in your browser
- Filter by category, status (To Do / Done), or search by name
- Tap any item to see description, location, and drive time

## Setup

You need [Node.js](https://nodejs.org/) installed (v16+).

```bash
# Install dependencies
npm install

# Start the dev server (opens at http://localhost:5173)
npm run dev

# Build for production
npm run build
```

## Customizing

- **Add or edit items**: open `src/data.js` and modify the `ALL_ITEMS` array
- **Add a new category**: add items with a new `category` value, then add a matching entry to `CATEGORY_META` in `src/data.js`
- **Change your name in the header**: edit `src/App.jsx` line with "Manue's Bucket List"

Your visited/completed state is saved in `localStorage` so it persists between browser sessions.
