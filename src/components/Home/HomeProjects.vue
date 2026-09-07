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
  <section v-animate id="projectsPreview" class="container flex-column gap-md">
    <div class="container flex-middle flex-between">
      <h4 class="container gap-sm flex-middle">
        {{ title }}
        <span class="nav-arrow icon-arrow_down small" aria-hidden="true"></span>
      </h4>
      <Button variant="stroke" href="projects">View all</Button>
    </div>

    <div class="grid gap-xl">
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
          :date="project.date"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  padding-bottom: 1rem;
}
</style>
