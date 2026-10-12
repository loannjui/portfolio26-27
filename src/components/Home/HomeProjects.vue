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
  <section id="projectsPreview" class="container flex-column gap-md pad-section">
    <div v-animate class="container flex-middle flex-between">
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
        v-animate
        class="col-xs-12 col-xl-6"
      >
        <ProjectThumbnail
          :title="project.title"
          :to="`/projects/${project.slug}`"
          :source="project.cover"
          :alt="project.title"
          :date="project.date"
          :end-date="project.endDate"
        />
      </div>
    </div>
  </section>
</template>
