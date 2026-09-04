<script setup>
import { computed } from "vue";
import TabList from "../General/TabList.vue";

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
  <section
    id="about"
    class="hero container flex-column flex-end gap-xl pad-section"
  >
    <h2 v-animate>{{ title }}</h2>
    <h3 v-animate></h3>
    <TabList
      v-animate
      v-if="table"
      :columns="table.columns"
      :rows="table.rows"
    />
  </section>
</template>
