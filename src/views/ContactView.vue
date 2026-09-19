<script setup>
import {
  useSanityQuery,
  CONTENT_ERROR,
} from "../composables/useSanityQuery.js";
import { contactQuery } from "../services/queries.js";
import ContactSection from "../components/Contact/ContactSection.vue";

const { data: hero, error } = useSanityQuery(contactQuery);
</script>

<template>
  <p v-if="error" role="alert">{{ CONTENT_ERROR }}</p>

  <ContactSection
    v-else-if="hero"
    :title="hero.title"
    :subtitle="hero.subtitle"
    :content="hero.content"
  />
</template>
