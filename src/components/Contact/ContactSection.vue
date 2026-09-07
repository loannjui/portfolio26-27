<script setup>
import { computed } from "vue";
import ContactForm from "./ContactForm.vue";
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
const table = computed(() => props.content.find((b) => b._type === "table"));
</script>

<template>
  <section v-animate id="contact" class="grid">
    <div class="col-xs-12 col-xl-12 container flex-column gap-md">
      <h2>{{ title }}</h2>
      <div class="separator" />
    </div>
    <div class="col-xs-12 col-xl-6">
      <p v-animate v-for="block in texts" :key="block._key">
        {{ block.content }}
      </p>
    </div>
    <ContactForm />
    <div class="col-xs-12 col-xl-12">
      <Tab
        v-animate
        v-if="table"
        :columns="table.columns"
        :rows="table.rows"
        :show-header="false"
      />
    </div>
  </section>
</template>

<style scoped>
#contact {
  background-color: var(--color-main);
  color: var(--color-main-bg);
  border-radius: 0.5rem;
  padding: 2rem;
}
</style>
