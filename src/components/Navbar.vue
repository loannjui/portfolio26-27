<script setup>
import Button from "./Button.vue";

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.dataset.theme;

  html.dataset.theme = currentTheme === "dark" ? "light" : "dark";
}
</script>

<template>
  <nav>
    <a class="logo"></a>
    Hihi
    <Button variant="filled" @click="toggleTheme">{{ theme === 'light' ? 'Dark' : 'Light' }}</Button>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
