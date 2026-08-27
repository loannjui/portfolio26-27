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
  <section id="projectsPreview">
    <div class="container flex-middle flex-between">
      <div class="container gap-sm">
        <h4>
          {{ title }}
          <span
            class="nav-arrow icon-arrow_down small"
            aria-hidden="true"
          ></span>
        </h4>
      </div>
      <Button variant="stroke" href="projects">View all</Button>
    </div>

    <div class="grid">
      <div
        v-for="project in projects"
        :key="project._id"
        class="col-xs-12 col-xl-4"
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
