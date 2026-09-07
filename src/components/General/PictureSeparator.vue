<script setup>
import { useSanityQuery } from "../../composables/useSanityQuery.js";
import { mediaByTitleQuery } from "../../services/queries.js";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const { data } = useSanityQuery(mediaByTitleQuery, { title: props.name });
</script>

<template>
  <div v-if="data?.url" v-animate:fade class="picture-separator">
    <img :src="data.url" :alt="data.alt ?? ''" />
  </div>
</template>

<style scoped>
.picture-separator {
  width: 100%;
  height: 120px;
  overflow: hidden;
  border-radius: var(--border-radius);
}

.picture-separator img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

@media (min-width: 1440px) {
  .picture-separator {
    height: 200px;
  }
}
</style>
