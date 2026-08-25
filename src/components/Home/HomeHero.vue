<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  content: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <section id="home" class="hero container flex-column flex-end">
      <template v-for="block in content" :key="block._key">
        <h3 class="col-xl-5" v-if="block._type === 'textBlock'">
          {{ block.content }}
        </h3>

        <img
          class="img-responsive col-xl-4"
          v-else-if="block._type === 'reference' && block.url"
          :src="block.url"
          :alt="block.alt"
        />
      </template>

      <h1 class="hero-title">
        {{ title }}
        <span v-if="subtitle" class="hero-subtitle">{{ subtitle }}</span>
      </h1>
  </section>
</template>

<style scoped>
#home {
  height: 100dvh;
}
.hero-subtitle {
  display: block;
}
.hero-title {
  font-size: 15.1cqw;
}

h3 {
  color: var(--color-main-bg);
  mix-blend-mode: exclusion;

  [data-theme="dark"] & {
    color: var(--color-main);
  }
}

img {
  position: absolute;
  z-index: -1;
  @media (min-width: 1440px) {
    left: 25%;
    top: 24%;
  }
}
</style>
