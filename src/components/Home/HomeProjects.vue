<script setup>
import Button from "../General/Button.vue";
import ProjectThumbnail from "../General/ProjectThumbnail.vue";

defineProps({
  title: {
    type: String,
    default: "Recent work",
  },
  projects: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="container flex-middle flex-between">
    <h3>{{ title }}</h3>
    <Button variant="stroke" href="projects">View all</Button>
  </div>

  <div class="grid">
    <div
      v-for="project in projects"
      :key="project._id"
      class="col-xs-12 col-xl-6"
    >
      <ProjectThumbnail
        :title="project.title"
        :to="`/projects/${project.slug}`"
        :src="project.coverUrl"
        :alt="project.title"
      />
    </div>
  </div>
</template>
