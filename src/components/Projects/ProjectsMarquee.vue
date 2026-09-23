<script setup>
import { computed, onUnmounted, ref } from "vue";
import ProjectThumbnail from "../General/ProjectThumbnail.vue";

const RAMP_MS = 700;

const props = defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
});

const loop = computed(() => [...props.projects, ...props.projects]);

function isOffset(index) {
  return (index % (props.projects.length || 1)) % 2 === 1;
}

const track = ref(null);
let frame = null;
let rate = 1;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function rampTo(target) {
  const animation = track.value?.getAnimations()[0];
  if (!animation) return;

  cancelAnimationFrame(frame);

  const from = rate;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / RAMP_MS, 1);
    rate = from + (target - from) * easeInOut(progress);
    animation.playbackRate = rate;
    frame = progress < 1 ? requestAnimationFrame(step) : null;
  }

  frame = requestAnimationFrame(step);
}

onUnmounted(() => cancelAnimationFrame(frame));
</script>

<template>
  <section
    v-animate
    id="projectsPreview"
    class="marquee"
    :style="{ '--marquee-items': projects.length }"
  >
    <div ref="track" class="marquee-track">
      <div
        v-for="(project, index) in loop"
        :key="`${project._id}-${index}`"
        class="marquee-item"
        :class="{ 'is-offset': isOffset(index) }"
        :aria-hidden="index >= projects.length ? 'true' : null"
        @mouseenter="rampTo(0)"
        @mouseleave="rampTo(1)"
      >
        <ProjectThumbnail
          :title="project.title"
          :to="`/projects/${project.slug}`"
          :source="project.cover"
          sizes="min(32rem, 80vw)"
          :alt="project.title"
          :date="project.date"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
#projectsPreview {
  padding-top: 1.5rem;
  @media (min-width: 768px) {
    padding-top: 2.5rem;
  }
}
.marquee {
  --marquee-offset: 3rem;
  --marquee-speed: 10s;

  overflow: hidden;
  padding-bottom: 1rem;
  margin-inline: -1rem;

  @media (min-width: 768px) {
    margin-inline: -1.5rem;
  }

  @media (min-width: 1440px) {
    margin-inline: -3rem;
  }
}

.marquee-track {
  display: flex;
  width: max-content;
  padding: 0 0 var(--marquee-offset);
  animation: marquee calc(var(--marquee-items, 4) * var(--marquee-speed)) linear
    infinite;
}

.marquee-item {
  flex: none;
  width: min(32rem, 80vw);
  margin-right: 1rem;

  @media (min-width: 768px) {
    margin-right: 2rem;
  }
}

.marquee-item.is-offset {
  transform: translateY(var(--marquee-offset));
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
