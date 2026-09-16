<script setup>
import { computed } from "vue";

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

const texts = computed(() =>
  props.content.filter((b) => b._type === "textBlock"),
);
</script>

<template>
  <div class="grid">
    <div class="col-xl-4 col-xs-12 container flex-column gap-md">
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
