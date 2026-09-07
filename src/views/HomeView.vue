<script setup>
import { computed } from "vue";
import { useSanityQuery } from "../composables/useSanityQuery.js";
import {
  homeQuery,
  aboutHomeQuery,
  whatICanDoQuery,
  contactQuery,
} from "../services/queries.js";
import HomeHero from "../components/Home/HomeHero.vue";
import HomeProjects from "../components/Home/HomeProjects.vue";
import AboutHero from "../components/About/AboutHero.vue";
import PictureSeparator from "@/components/General/PictureSeparator.vue";
import WhatICanDo from "@/components/About/WhatICanDo.vue";
import ContactSection from "@/components/Contact/ContactSection.vue";

const { data: page, error: pageError } = useSanityQuery(homeQuery);
const { data: aboutHero, error: aboutError } = useSanityQuery(aboutHomeQuery);
const { data: whatICanDo, error: whatICanDoError } =
  useSanityQuery(whatICanDoQuery);
const { data: contactSection, error: contactSectionError } =
  useSanityQuery(contactQuery);

const error = computed(
  () =>
    pageError.value ??
    aboutError.value ??
    whatICanDoError.value ??
    contactSectionError.value,
);

const sections = computed(() => page.value?.sections ?? []);
const hero = computed(() => sections.value.find((s) => s._type === "section"));
const projectsSection = computed(() =>
  sections.value.find((s) => s._type === "projectsSection"),
);
</script>

<template>
  <p v-if="error" role="alert">Le contenu n’a pas pu être chargé.</p>

  <template v-else>
    <HomeHero
      v-if="hero"
      :title="hero.title"
      :subtitle="hero.subtitle"
      :content="hero.content"
    />
    <HomeProjects
      v-if="projectsSection?.projects?.length"
      :title="projectsSection.title ?? undefined"
      :projects="projectsSection.projects"
    />
    <AboutHero
      v-if="aboutHero"
      :title="aboutHero.title"
      :subtitle="aboutHero.subtitle"
      :content="aboutHero.content"
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
</template>
