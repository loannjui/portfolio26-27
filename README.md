## Project

Personal 2026 portfolio for myself. Coded with vue with content managed by Sanity.

## Tech

- **Vue 3** (Composition API, `<script setup>`) + **Vue Router**
- **Vite** for development and builds
- **Sanity** as a headless CMS (GROQ queries via @sanity/client, optimized images via @sanity/image-url)
- **Web3Forms** to send the contact form

## Features
- All content comes from the CMS, with no hardcoded text
- Responsive images generated from Sanity
- Query caching in production to cut down on API calls
- Light / dark theme saved in LocalStorage
- Scroll-triggered reveal animations through v-animate

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
