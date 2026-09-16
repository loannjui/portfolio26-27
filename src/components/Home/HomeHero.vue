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
  <section id="home" class="hero container flex-column flex-end gap-md">
    <template v-for="block in content" :key="block._key">
      <h4
        v-animate
        class="flex-xs-12 flex-xl-5"
        v-if="block._type === 'textBlock'"
      >
        {{ block.content }}
      </h4>
      <div
        v-animate:fade
        class="hero-img"
        v-else-if="block._type === 'reference' && block.url"
      >
        <img class="img-responsive" :src="block.url" :alt="block.alt" />
      </div>
    </template>

    <h1 class="hero-title">
      <span v-animate:reveal class="reveal"
        ><span>{{ title }}</span></span
      >
      <span v-if="subtitle" v-animate:reveal class="hero-subtitle reveal"
        ><span>{{ subtitle }}</span></span
      >
    </h1>
  </section>
</template>

<style scoped>
#home {
  padding-top: 60vh;

  @media (min-width: 1440px) {
    height: 80dvh;
    padding-top: 0;
  }
}
</style>
