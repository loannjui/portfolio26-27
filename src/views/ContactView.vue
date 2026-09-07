<script setup>
import { useSanityQuery } from "../composables/useSanityQuery.js";
import { contactQuery } from "../services/queries.js";
import ContactSection from "../components/Contact/ContactSection.vue";

const { data: hero, error } = useSanityQuery(contactQuery);
</script>

<template>
  <p v-if="error" role="alert">Le contenu n’a pas pu être chargé.</p>

  <ContactSection
    v-else-if="hero"
    :title="hero.title"
    :subtitle="hero.subtitle"
    :content="hero.content"
  />
</template>
