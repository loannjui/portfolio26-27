<script setup>
import { computed } from "vue";
import { imageSize, imageSrcset, imageUrl } from "../../services/image.js";

const props = defineProps({
  // Sanity image object
  source: {
    type: Object,
    default: null,
  },
  alt: {
    type: String,
    default: "",
  },
  // Largest width 
  width: {
    type: Number,
    default: 1920,
  },
  // width / height. Crops around the hotspot rather than leaving it to CSS
  ratio: {
    type: Number,
    default: null,
  },
  // What share of the viewport the image takes
  sizes: {
    type: String,
    default: "100vw",
  },
  loading: {
    type: String,
    default: "lazy",
  },
});

const options = computed(() => ({ width: props.width, ratio: props.ratio }));

const src = computed(() => imageUrl(props.source, options.value));
const srcset = computed(() => imageSrcset(props.source, options.value));
const size = computed(() => imageSize(props.source, props.ratio));
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :srcset="srcset"
    :sizes="srcset ? sizes : undefined"
    :alt="alt"
    :width="size.width"
    :height="size.height"
    :loading="loading"
    decoding="async"
  />
</template>
