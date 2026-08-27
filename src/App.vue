<script setup>
import Navbar from "./components/General/Navbar.vue";
</script>

<template>
  <Navbar />
  <main class="container flex-column">
    <RouterView />
  </main>
</template>
