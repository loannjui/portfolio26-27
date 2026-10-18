## Project

Personal 2026 portfolio for myself. Coded with Vue.js with content managed by Sanity.

## Tech

- **Vue 3** (Composition API, `<script setup>`) + **Vue Router**
- **Vite** for development and builds
- **Sanity** as a headless CMS (GROQ queries via `@sanity/client`, optimized images via `@sanity/image-url`)
- **Web3Forms** to send the contact form

## Features
- All content comes from a headless CMS
- Responsive images generated from Sanity
- Sanity queries cached in LocalStorage (5 min TTL) in production to cut down on API calls
- Light / dark theme saved in LocalStorage
- Scroll-triggered reveal animations through `v-animate`

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
