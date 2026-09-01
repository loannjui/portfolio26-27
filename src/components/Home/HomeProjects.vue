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
  <section id="projectsPreview" class="container flex-column gap-m fade-in">
    <div class="container flex-middle flex-between">
      <h3 class="container gap-sm flex-middle">
        {{ title }}
        <span class="nav-arrow icon-arrow_down small" aria-hidden="true"></span>
      </h3>
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
  </section>
</template>
<style scoped>
#projectsPreview{
  animation-delay: var(--delay-4);
}
</style>
