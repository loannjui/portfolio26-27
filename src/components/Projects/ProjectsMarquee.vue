<script setup>
import { computed, onUnmounted, ref } from "vue";
import ProjectThumbnail from "../General/ProjectThumbnail.vue";

const RAMP_MS = 700;
const DRAG_THRESHOLD = 6;
const FRICTION = 0.95;

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

// Swipe (touch only)
let drag = null;
let dragged = false;

function getAnimation() {
  return track.value?.getAnimations()[0];
}

// Converts a horizontal distance (px) into animation time (ms)
function pxToMs(animation, px) {
  const duration = animation.effect.getComputedTiming().duration;
  return (-px * duration) / (track.value.offsetWidth / 2);
}

function seek(animation, delta) {
  const duration = animation.effect.getComputedTiming().duration;
  const time = animation.currentTime + delta;
  animation.currentTime = ((time % duration) + duration) % duration;
}

function onPointerDown(event) {
  if (event.pointerType === "mouse") return;
  const animation = getAnimation();
  if (!animation) return;

  cancelAnimationFrame(frame);
  rate = 0;
  animation.playbackRate = 0;

  dragged = false;
  drag = {
    animation,
    x: event.clientX,
    velocity: 0,
    time: performance.now(),
  };
}

function onPointerMove(event) {
  if (!drag) return;

  const dx = event.clientX - drag.x;
  if (!dragged && Math.abs(dx) < DRAG_THRESHOLD) return;
  if (!dragged) {
    dragged = true;
    track.value.setPointerCapture(event.pointerId);
  }

  const now = performance.now();
  drag.velocity = dx / Math.max(now - drag.time, 1);
  drag.x = event.clientX;
  drag.time = now;

  seek(drag.animation, pxToMs(drag.animation, dx));
}

function onPointerUp() {
  if (!drag) return;
  const { animation } = drag;
  let velocity = dragged ? drag.velocity : 0;
  drag = null;

  // Inertia, then resume the marquee
  let last = performance.now();
  function glide(now) {
    seek(animation, pxToMs(animation, velocity * (now - last)));
    velocity *= FRICTION;
    last = now;
    if (Math.abs(velocity) > 0.02) {
      frame = requestAnimationFrame(glide);
    } else {
      rampTo(1);
    }
  }
  frame = requestAnimationFrame(glide);
}

// Prevents opening a project at the end of a swipe
function onClickCapture(event) {
  if (!dragged) return;
  event.preventDefault();
  event.stopPropagation();
  dragged = false;
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
    <div
      ref="track"
      class="marquee-track"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @click.capture="onClickCapture"
    >
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
    margin-inline: -4rem;
  }
}

.marquee-track {
  display: flex;
  width: max-content;
  padding: 0 0 var(--marquee-offset);
  animation: marquee calc(var(--marquee-items, 4) * var(--marquee-speed)) linear
    infinite;
  touch-action: pan-y;
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
