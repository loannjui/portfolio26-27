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

const table = computed(() => props.content.find((b) => b._type === "table"));
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
