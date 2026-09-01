<script setup>
import { computed } from "vue";
import { useSanityQuery } from "../composables/useSanityQuery.js";
import { homeQuery } from "../services/queries.js";
import HomeHero from "../components/Home/HomeHero.vue";
import HomeProjects from "../components/Home/HomeProjects.vue";

const { data: page, error } = useSanityQuery(homeQuery);

const sections = computed(() => page.value?.sections ?? []);
const hero = computed(() => sections.value.find((s) => s._type === "section"));
const projectsSection = computed(() =>
  sections.value.find((s) => s._type === "projectsSection")
);
</script>

<template>
  <p v-if="error" role="alert">Le contenu n’a pas pu être chargé.</p>

  <template v-else>
    <HomeHero v-if="hero" :title="hero.title" :subtitle="hero.subtitle" :content="hero.content"/>
    <HomeProjects
      v-if="projectsSection?.projects?.length"
      :title="projectsSection.title ?? undefined"
      :projects="projectsSection.projects"
    />
  </template>
</template>
