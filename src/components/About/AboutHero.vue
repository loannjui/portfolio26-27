<script setup>
import { computed } from "vue";
import Tab from "../General/Tab.vue";

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
    <div class="container flex-column gap-md">
      <h2 v-animate>{{ title }}</h2>
      <div v-animate class="separator" />
    </div>
    <div class="grid gap-xl">
      <div class="col-xs-12 col-xl-4">
        <figure
          v-animate:fade
          class="wrapper"
          v-for="block in images"
          :key="block._key"
          v-show="block.url"
        >
          <img class="img-responsive" :src="block.url" :alt="block.alt" />
        </figure>
      </div>

      <div v-animate class="col-xs-12 col-xl-6 container flex-column">
        <p v-for="block in texts" :key="block._key">
          {{ block.content }}
        </p>
      </div>
    </div>
    <Tab v-if="table" :columns="table.columns" :rows="table.rows" />
  </section>
</template>

<style scoped>
section {
  padding-bottom: 3rem;
}
</style>