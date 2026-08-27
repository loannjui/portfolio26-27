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
      <h3 class="flex-xs-12 flex-xl-5" v-if="block._type === 'textBlock'">
        {{ block.content }}
      </h3>
      <div
        class="hero-img flex-xs-12 flex-xl-4"
        v-else-if="block._type === 'reference' && block.url"
      >
        <img class="img-responsive" :src="block.url" :alt="block.alt" />
      </div>
    </template>

    <h1 class="hero-title">
      {{ title }}
      <span v-if="subtitle" class="hero-subtitle">{{ subtitle }}</span>
    </h1>
  </section>
</template>

<style scoped>
#home {
  gap: 1rem;
  padding-top: 450px;

  @media (min-width: 1440px) {
    gap: 2rem;
    height: 80dvh;
    padding-top: 0;
  }
}
.hero-subtitle {
  display: block;
}
.hero-title {
  font-size: 15.13cqw;
  line-height: 0.9;
  overflow: hidden;

  @media (min-width: 1440px) {
    font-size: 15.28cqw;
    margin: 0 -0.5rem;
  }

  @media (min-width: 1920px) {
    font-size: 15.21cqw;
  }
}

.hero-img {
  position: absolute;
  z-index: -1;
  width: calc(100% - 2rem);
  left: 1rem;
  top: 320px;

  @media (min-width: 1440px) {
    width: 33.3333%;
    left: auto;
    right: 10rem;
    top: 7.25rem;
  }
}

.hero-img img {
  width: 100%;
  height: auto;
}
</style>
