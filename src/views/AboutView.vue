<script setup>
import { computed } from "vue";
import {
  useSanityQuery,
  CONTENT_ERROR,
} from "../composables/useSanityQuery.js";
import {
  aboutHeroQuery,
  whatICanDoQuery,
  aboutProjectQuery,
  contactQuery,
} from "../services/queries.js";
import AboutHero from "../components/About/AboutHero.vue";
import WhatICanDo from "@/components/About/WhatICanDo.vue";
import ContactSection from "../components/Contact/ContactSection.vue";
import AboutProject from "../components/About/AboutProject.vue";

const { data: hero, error: heroError } = useSanityQuery(aboutHeroQuery);
const { data: whatICanDo, error: whatICanDoError } =
  useSanityQuery(whatICanDoQuery);
const { data: aboutProject, error: aboutProjectError } =
  useSanityQuery(aboutProjectQuery);
const { data: contactSection, error: contactSectionError } =
  useSanityQuery(contactQuery);

const error = computed(
  () =>
    heroError.value ??
    whatICanDoError.value ??
    aboutProjectError.value ??
    contactSectionError.value,
);
</script>

<template>
  <p v-if="error" role="alert">{{ CONTENT_ERROR }}</p>

  <AboutHero
    v-else-if="hero"
    :title="hero.title"
    :subtitle="hero.subtitle"
    :content="hero.content"
  />
  <AboutProject
    v-if="aboutProject"
    :title="aboutProject.title"
    :content="aboutProject.content"
  />
  <WhatICanDo
    v-if="whatICanDo"
    :title="whatICanDo.title"
    :content="whatICanDo.content"
  />
  <ContactSection
    v-if="contactSection"
    :title="contactSection.title"
    :content="contactSection.content"
  />
</template>
