<script setup>
import {
  useSanityQuery,
  CONTENT_ERROR,
} from "../composables/useSanityQuery.js";
import { projectsQuery, allProjectsQuery } from "../services/queries.js";
import ProjectsHero from "../components/Projects/ProjectsHero.vue";
import ProjectsMarquee from "../components/Projects/ProjectsMarquee.vue";

const { data: hero, error } = useSanityQuery(projectsQuery);
const { data: projects, error: projectsError } =
  useSanityQuery(allProjectsQuery);
</script>

<template>
  <section id="projects" class="container flex-middle">
    <div class="container flex-column wd-100">
      <p v-if="error || projectsError" role="alert">{{ CONTENT_ERROR }}</p>

      <template v-else>
        <ProjectsHero v-if="hero" :title="hero.title" :content="hero.content" />
        <div v-if="projects" v-animate>
          <ProjectsMarquee :projects="projects" />
        </div>
      </template>
    </div>
  </section>
</template>
