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
  <section id="home" class="hero container flex-column flex-end gap-m">
    <template v-for="block in content" :key="block._key">
      <h3 class="flex-xs-12 flex-xl-5 reveal" v-if="block._type === 'textBlock'">
        <span>{{ block.content }}</span>
      </h3>
      <div
        class="hero-img flex-xs-12 flex-xl-4"
        v-else-if="block._type === 'reference' && block.url"
      >
        <img class="img-responsive" :src="block.url" :alt="block.alt" />
      </div>
    </template>

    <h1 class="hero-title">
      <span class="reveal"><span>{{ title }}</span></span>
      <span v-if="subtitle" class="hero-subtitle reveal"><span>{{ subtitle }}</span></span>
    </h1>
  </section>
</template>

<style scoped>
#home {
  padding-top: 450px;

  @media (min-width: 1440px) {
    height: 80dvh;
    padding-top: 0;
  }
}
.hero-subtitle {
  display: block;
}

/* Apparition du texte, de bas en haut, au chargement de la page */
.reveal {
  display: block;
  overflow: hidden;
}

.reveal > span {
  display: block;
  animation: rise-in 0.9s cubic-bezier(0.075, 0.82, 0.165, 1) both;
}

h3.reveal > span {
  animation-delay: 0.05s;
}

.hero-title > .reveal:first-child > span {
  animation-delay: 0.2s;
}

.hero-subtitle > span {
  animation-delay: 0.35s;
}

@keyframes rise-in {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal > span {
    animation: none;
  }
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
  width: calc(100% - 4rem);
  left: 2rem;
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
  filter: invert(0);
  transition: invert var(--transition-main);

  [data-theme="dark"] & {
    filter: invert(1);
  }
}
</style>
