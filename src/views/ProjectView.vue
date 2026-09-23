<script setup>
import { useRoute } from "vue-router";
import {
  useSanityQuery,
  CONTENT_ERROR,
} from "../composables/useSanityQuery.js";
import { projectQuery } from "../services/queries.js";
import ProjectSection from "../components/Projects/ProjectSection.vue";
import ProjectHero from "../components/Projects/ProjectHero.vue";

const route = useRoute();

const { data: project, error } = useSanityQuery(projectQuery, {
  slug: route.params.slug,
});
</script>

<template>
  <p v-if="error" role="alert">{{ CONTENT_ERROR }}</p>

  <template v-else-if="project">
    <ProjectHero
      :title="project.title"
      :excerpt="project.excerpt"
      :skills="project.skills"
      :category="project.category"
      :external-url="project.externalUrl"
      :cover-url="project.coverUrl"
    />

    <ProjectSection
      v-for="section in project.sections ?? []"
      :key="section._key"
      :title="section.title"
      :subtitle="section.subtitle"
      :content="section.content"
    />
  </template>
</template>
