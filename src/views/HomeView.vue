<script setup>
import { computed } from "vue";
import { useSanityQuery } from "../composables/useSanityQuery.js";
import { homeQuery, recentProjectsQuery } from "../services/queries.js";
import HomeHero from "../components/Home/HomeHero.vue";
import HomeProjects from "../components/Home/HomeProjects.vue";

const { data: page, error } = useSanityQuery(homeQuery);
const { data: projectList, error: projectsError } = useSanityQuery(recentProjectsQuery);

const hero = computed(() => page.value?.sections?.[0]);
const projects = computed(() => projectList.value ?? []);
</script>

<template>
  <p v-if="error || projectsError" role="alert">Le contenu n’a pas pu être chargé.</p>

  <HomeHero v-else-if="hero" :title="hero.title" :subtitle="hero.subtitle" :content="hero.content"/>
  <HomeProjects v-if="projects.length" :projects="projects" />
</template>
