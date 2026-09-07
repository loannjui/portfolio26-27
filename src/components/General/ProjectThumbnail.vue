<script setup>
import { ref } from "vue";
import Button from "./Button.vue";

defineProps({
  title: {
    type: String,
    default: "",
  },
  to: {
    type: String,
    default: "",
  },
  src: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    default: "",
  },
});

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
  <RouterLink class="wrapper container flex-column gap-md" v-if="to" :to="to" @mousemove="follow">
    <img v-if="src" class="img-responsive" :src="src" :alt="alt" />
    <div class="container flex-between">
      <h5>{{ title }}</h5>
      <time v-if="date" :datetime="date">{{ date.slice(0, 4) }}</time>
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

.wrapper:hover .view {
  opacity: 0.5;
}
</style>
