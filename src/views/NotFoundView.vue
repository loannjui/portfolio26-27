<script setup>
import {
  useSanityQuery,
  CONTENT_ERROR,
} from "../composables/useSanityQuery.js";
import { notFoundQuery } from "../services/queries.js";
import AboutHero from "../components/About/AboutHero.vue";
import Button from "../components/General/Button.vue";

const { data: hero, error } = useSanityQuery(notFoundQuery);
</script>

<template>
  <p v-if="error" role="alert">{{ CONTENT_ERROR }}</p>

  <AboutHero
    v-else-if="hero"
    :title="hero.title"
    :subtitle="hero.subtitle"
    :content="hero.content"
  >
    <RouterLink to="/" class="home-link">
      <Button tag="span" variant="stroke">
        Back to home
        <span class="icon-arrow small" aria-hidden="true"></span>
      </Button>
    </RouterLink>
  </AboutHero>
</template>

<style scoped>
:deep(.hero-title .reveal) {
  padding-bottom: 0.12em;
}

.home-link {
  align-self: flex-start;
  text-decoration: none;
}
</style>
