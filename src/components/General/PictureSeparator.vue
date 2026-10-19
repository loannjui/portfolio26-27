<script setup>
import { useSanityQuery } from "../../composables/useSanityQuery.js";
import { mediaByTitleQuery } from "../../services/queries.js";
import SanityImage from "./SanityImage.vue";

const SEPARATOR_RATIO = 4;

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const { data } = useSanityQuery(mediaByTitleQuery, { title: props.name });
</script>

<template>
  <div v-if="data?.image" v-animate class="picture-separator">
    <SanityImage
      :source="data.image"
      :alt="data.alt ?? ''"
      :ratio="SEPARATOR_RATIO"
    />
  </div>
</template>

<style scoped>
.picture-separator {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: var(--border-radius);
  margin-bottom: var(--section-padding);
}

.picture-separator img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: invert(0);
  transition: filter var(--transi-fast) var(--bezier-o);

  [data-theme="dark"] & {
    filter: invert(1);
  }
}
</style>
