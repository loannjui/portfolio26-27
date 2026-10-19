<script setup>
import Tab from "../General/Tab.vue";
import SanityImage from "../General/SanityImage.vue";
import { useBlocks } from "../../composables/useBlocks.js";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  content: {
    type: Array,
    default: () => [],
  },
});

const { texts, images, table } = useBlocks(() => props.content);
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
      <div class="col-xs-12 col-md-6 col-xl-4">
        <figure
          v-animate
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
      <div v-animate class="col-xs-12 col-md-6 col-xl-4 container flex-column">
        <p v-for="block in texts" :key="block._key">
          {{ block.content }}
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
