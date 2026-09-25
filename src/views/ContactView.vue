<script setup>
import {
  useSanityQuery,
  CONTENT_ERROR,
} from "../composables/useSanityQuery.js";
import { contactQuery } from "../services/queries.js";
import ContactForm from "../components/Contact/ContactForm.vue";

const { data: hero, error } = useSanityQuery(contactQuery);
</script>

<template>
  <p v-if="error" role="alert">{{ CONTENT_ERROR }}</p>

  <div v-else-if="hero" class="container flex-column contact-page">
    <ContactForm
      :title="hero.title"
      :subtitle="hero.subtitle"
      :content="hero.content"
    />
  </div>
</template>

<style scoped>
.contact-page {
  padding-top: 5.75rem;
}

@media (min-width: 1440px) {
  .contact-page {
    min-height: 100vh;
    justify-content: center;
    padding-top: 0;
  }
}
</style>
