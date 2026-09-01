<script setup>
import { useSanityQuery } from "../composables/useSanityQuery.js";
import { aboutHeroQuery } from "../services/queries.js";
import AboutHero from "../components/About/AboutHero.vue";

const { data: hero, error } = useSanityQuery(aboutHeroQuery);
</script>

<template>
  <p v-if="error" role="alert">Le contenu n’a pas pu être chargé.</p>

  <AboutHero
    v-else-if="hero"
    :title="hero.title"
    :subtitle="hero.subtitle"
    :content="hero.content"
  />
</template>
