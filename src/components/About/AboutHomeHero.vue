<script setup>
import { computed } from "vue";
import Tab from "../General/Tab.vue";
import SanityImage from "../General/SanityImage.vue";

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
    id="aboutSection"
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
          v-show="block.image"
        >
          <SanityImage
            class="img-responsive"
            :source="block.image"
            :alt="block.alt"
            sizes="(min-width: 1440px) 33vw, 100vw"
          />
        </figure>
      </div>
      <div v-animate class="col-xs-12 col-xl-4 container flex-column">
        <p v-for="block in texts" :key="block._key">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ block.content }}
        </p>
      </div>
    </div>
    <Tab v-if="table" :columns="table.columns" :rows="table.rows" />
  </section>
</template>

<style scoped>
.wrapper img {
  filter: invert(0);
  transition: filter var(--transi-fast) var(--bezier-o);

  [data-theme="dark"] & {
    filter: invert(1);
  }
}
</style>
