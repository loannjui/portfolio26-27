<script setup>
import { ref } from "vue";
import Button from "./Button.vue";
import SanityImage from "./SanityImage.vue";

defineProps({
  title: {
    type: String,
    default: "",
  },
  to: {
    type: String,
    default: "",
  },
  source: {
    type: Object,
    default: null,
  },
  alt: {
    type: String,
    default: "",
  },
  sizes: {
    type: String,
    default: "(min-width: 1440px) 50vw, 100vw",
  },
  date: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
});

// The CSS crops the thumbnail to 16/9 anyway; asking the CDN for that shape
// means the crop follows the hotspot instead of the middle of the image
const THUMBNAIL_RATIO = 16 / 9;

// cursor position
const x = ref(0);
const y = ref(0);

function follow(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  x.value = event.clientX - rect.left;
  y.value = event.clientY - rect.top;
}
</script>

<template>
  <RouterLink
    class="wrapper container flex-column gap-md"
    v-if="to"
    :to="to"
    @mousemove="follow"
  >
    <SanityImage
      class="img-responsive"
      :source="source"
      :alt="alt"
      :ratio="THUMBNAIL_RATIO"
      :sizes="sizes"
    />
    <div class="art-details container flex-between">
      <h5>{{ title }}</h5>
      <span v-if="date">
        <time :datetime="date">{{ date.slice(0, 4) }}</time>
        <template v-if="endDate">
          - <time :datetime="endDate">{{ endDate.slice(0, 4) }}</time>
        </template>
      </span>
    </div>
    <Button
      tag="span"
      variant="filled"
      class="view all-caps"
      aria-hidden="true"
      :style="{ '--x': `${x}px`, '--y': `${y}px` }"
    >
      View
    </Button>
  </RouterLink>
</template>

<style scoped>
/* Darkens the bottom of the image so the title stays readable */
.wrapper::before {
  content: "";
  position: absolute;
  inset: 25% 0 0;
  background: linear-gradient(to top, rgb(0 0 0 / 0.75), transparent);
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  pointer-events: none;
}

.art-details {
  position: absolute;
  width: calc(100% - 2rem);
  left: 1rem;
  bottom: 1rem;
  color: var(--white);
  mix-blend-mode: exclusion;
}

.view {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  min-height: 0;
  transform: translate(calc(var(--x) - 50%), calc(var(--y) - 100% - 0.25rem));
  opacity: 0;
  transition:
    opacity var(--transi-rl-slow) var(--bezier-o),
    transform 0.15s linear;
  pointer-events: none;
}

@media (hover: hover) {
  .wrapper:hover .view {
    opacity: 0.7;
  }
}
</style>
