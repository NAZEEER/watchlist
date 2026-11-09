# WatchList

A React and Vite product-list application with debounced search and custom list virtualization.

> Portfolio draft: this README is prepared for review. It has not been published to GitHub.

## Features

- Fetches up to 100 products from the DummyJSON REST API.
- Shows loading and fetch-error states.
- Filters products by title through a search input.
- Debounces search updates by 300 milliseconds.
- Memoizes the filtered product list with `useMemo`.
- Measures rendered product-card heights through element refs and `offsetHeight`.
- Uses cumulative positions and binary search to locate the first visible item.
- Renders the visible range with a small buffer instead of mounting every product card.

## Tech Stack

- React
- JavaScript and JSX
- Vite
- CSS
- Fetch API
- DummyJSON product API

## Architecture and Implementation

The `Watchlist` component owns API data, search state, scroll position, measured item heights, and calculated item positions. Search input is kept separate from the debounced query so typing does not immediately recompute the filtered list. The filtered list is memoized from the fetched products and debounced query.

Virtualization uses a fixed-height scroll container and a spacer representing the full calculated list height. Each rendered card records its current `offsetHeight` in a ref map. Cumulative positions are rebuilt from those measurements, and a binary-search helper maps the current scroll offset to a starting item before the visible slice is rendered.

## Getting Started

### Requirements

- Node.js
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

### Other scripts

```bash
npm run build
npm run lint
npm run preview
```

## Project Structure

```text
src/
  App.jsx
  Components/
    Watchlist.jsx
  main.jsx
```

## Screenshot and Demo

<!-- Screenshot placeholder: add a screenshot showing the product list and a second screenshot showing a filtered search result. -->

Live demo: `[Add deployed URL if one is available]`

## Notes

- The app depends on network access to `https://dummyjson.com`.
- The repository currently documents dynamic-height virtualization as a future improvement, but the source already measures rendered card heights. This draft updates the documentation to match the implementation.
