<script setup>
import { computed } from "vue";
import {
  useSanityQuery,
  CONTENT_ERROR,
} from "../composables/useSanityQuery.js";
import {
  aboutHeroQuery,
  whatICanDoQuery,
  contactQuery,
} from "../services/queries.js";
import AboutHero from "../components/About/AboutHero.vue";
import PictureSeparator from "@/components/General/PictureSeparator.vue";
import WhatICanDo from "@/components/About/WhatICanDo.vue";
import ContactSection from "../components/Contact/ContactSection.vue";

const { data: hero, error: heroError } = useSanityQuery(aboutHeroQuery);
const { data: whatICanDo, error: whatICanDoError } =
  useSanityQuery(whatICanDoQuery);
const { data: contactSection, error: contactSectionError } =
  useSanityQuery(contactQuery);

const error = computed(
  () => heroError.value ?? whatICanDoError.value ?? contactSectionError.value,
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
  <PictureSeparator name="Flower arrangement" />
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
