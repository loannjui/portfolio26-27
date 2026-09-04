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
        class="flex-xs-12 flex-xl-5 fade-in"
        v-if="block._type === 'textBlock'"
      >
        {{ block.content }}
      </h4>
      <div
        class="hero-img flex-xs-12 flex-xl-4 fade-in"
        v-else-if="block._type === 'reference' && block.url"
      >
        <img class="img-responsive" :src="block.url" :alt="block.alt" />
      </div>
    </template>

    <h1 class="hero-title">
      <span class="reveal"
        ><span>{{ title }}</span></span
      >
      <span v-if="subtitle" class="hero-subtitle reveal"
        ><span>{{ subtitle }}</span></span
      >
    </h1>
  </section>
</template>

<style scoped>
#home {
  padding-top: 50vh;

  @media (min-width: 1440px) {
    height: 80dvh;
    padding-top: 0;
  }
}
.hero-subtitle {
  display: block;
}

.hero-title > .reveal:first-child > span {
  animation-delay: var(--delay-2);
}

.hero-subtitle > span {
  animation-delay: var(--delay-3);
}

.hero-title {
  font-size: 15.5cqw;
  overflow: hidden;
  line-height: 0.9;

  @media (min-width: 1440px) {
    font-size: 15.7cqw;
    line-height: 0.9;
    margin: 0 -0.5rem;
  }

  @media (min-width: 1920px) {
    font-size: 15.21cqw;
  }
}

h4 {
  animation-delay: var(--delay-1);
}

.hero-img {
  animation-delay: var(--delay-2);
  position: absolute;
  z-index: -1;
  width: calc(100% - 4rem);
  left: 2rem;
  top: 35vh;

  @media (min-width: 768px) {
    width: 50%;
    left: auto;
    right: 2rem;
    top: 30vh;
  }

  @media (min-width: 1440px) {
    width: 33%;
    left: auto;
    right: 10rem;
    top: 5rem;
  }
}

.hero-img img {
  width: 100%;
  height: auto;
  filter: invert(0);
  transition: filter var(--transi-fast) var(--bezier-o);

  [data-theme="dark"] & {
    filter: invert(1);
  }
}
</style>
