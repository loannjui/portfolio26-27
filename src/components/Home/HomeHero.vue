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
  content: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="hero">
    <template v-for="block in content" :key="block._key">
      <p v-if="block._type === 'textBlock'">{{ block.content }}</p>

      <img class="img-responsive"
        v-else-if="block._type === 'reference' && block.url"
        :src="block.url"
        :alt="block.alt"
      >
    </template>

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
