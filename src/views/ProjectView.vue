<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import {
  useSanityQuery,
  CONTENT_ERROR,
} from "../composables/useSanityQuery.js";
import { projectQuery } from "../services/queries.js";
import ProjectSection from "../components/Projects/ProjectSection.vue";
import ProjectHero from "../components/Projects/ProjectHero.vue";
import Button from "../components/General/Button.vue";
import { setPageTitle } from "../router/index.js";

const route = useRoute();

const { data: project, error } = useSanityQuery(projectQuery, {
  slug: route.params.slug,
});

watch(project, (value) => setPageTitle(value?.title), { immediate: true });
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
      :external-url-label="project.externalUrlLabel"
      :cover="project.cover"
    />

    <ProjectSection
      v-for="(section, index) in project.sections ?? []"
      :key="section._key"
      :index="index"
      :title="section.title"
      :subtitle="section.subtitle"
      :content="section.content"
    />

    <section class="container pad-section">
      <RouterLink v-animate to="/projects" class="back-link container flex-middle gap-md">
        <Button tag="span" variant="stroke-round" aria-hidden="true">
          <span class="icon-arrow_back"></span>
        </Button>
        <h4>Back to projects</h4>
      </RouterLink>
    </section>
  </template>
</template>

<style scoped>
.back-link {
  color: inherit;
  text-decoration: none;
}
</style>
