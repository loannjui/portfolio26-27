<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  to: {
    type: String,
    default: "",
  },
  src: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <RouterLink class="wrapper" v-if="to" :to="to">
    <h3>{{ title }}</h3>
    <img v-if="src" class="img-responsive" :src="src" :alt="alt" />
  </RouterLink>
</template>

<style scoped>

h3 {
  position: absolute;
  z-index: 1;
  left: 1rem;
  bottom: 1rem;
  color: var(--color-main-bg);
  mix-blend-mode: difference;

  @media (min-width: 1440px) {
    left: 1.5rem;
    bottom: 1.5rem;
  }

  [data-theme="dark"] & {
    color: var(--color-main);
  }
}
</style>
