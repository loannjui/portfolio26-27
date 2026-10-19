<script setup>
import TabList from "../General/TabList.vue";
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

const { texts, table } = useBlocks(() => props.content);
</script>

<template>
  <section
    id="whatICanDo"
    class="hero container flex-column flex-end gap-md pad-section"
  >
    <h2 v-animate>{{ title }}</h2>
    <div class="grid">
      <div class="col-xl-8 col-xs-12">
        <h4 v-animate v-for="block in texts" :key="block._key">
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ block.content }}
        </h4>
      </div>
    </div>
    <TabList v-if="table" :columns="table.columns" :rows="table.rows" />
  </section>
</template>

<style scoped>
h4 {
  margin-bottom: 4rem;
}
</style>
