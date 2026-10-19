<script setup>
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

const { texts } = useBlocks(() => props.content);
</script>

<template>
  <div class="grid">
    <div class="col-xs-12 col-md-8 col-xl-4 container flex-column gap-md">
      <div class="container flex-column gap-md">
        <h1 v-animate>
          {{ title }}
        </h1>
        <div v-animate class="separator" />
      </div>
      <p v-for="block in texts" :key="block._key" v-animate>
        {{ block.content }}
      </p>
    </div>
  </div>
</template>
