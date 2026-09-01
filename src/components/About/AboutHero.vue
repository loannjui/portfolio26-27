<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  content: {
    type: Array,
    default: () => [],
  },
});

const texts = computed(() =>
  props.content.filter((b) => b._type === "textBlock"),
);
const images = computed(() =>
  props.content.filter((b) => b._type === "reference"),
);
const table = computed(() => props.content.find((b) => b._type === "table"));
</script>

<template>
  <section id="about" class="hero container flex-column flex-end gap-m">
    <h2>{{ title }}</h2>
    <div class="separator" />
    <div class="grid">
      <p v-for="block in texts" :key="block._key" class="col-xs-12 col-xl-6">
        {{ block.content }}
      </p>
    </div>
  </section>
</template>
