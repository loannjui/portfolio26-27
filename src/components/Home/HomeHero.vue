<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="hero">
    <h1>
      {{ title }}
      <span v-if="subtitle" class="hero-subtitle">{{ subtitle }}</span>
    </h1>
  </section>
</template>

<style scoped>
.hero-subtitle {
  display: block;
}
</style>