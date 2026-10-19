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
  <section id="about" class="hero container flex-column flex-end gap-xl">
    <div
      v-animate
      class="hero-img"
      v-for="block in images"
      :key="block._key"
      v-show="block.image"
    >
      <SanityImage
        class="img-responsive"
        :source="block.image"
        :alt="block.alt"
        sizes="(min-width: 1440px) 33vw, (min-width: 768px) 50vw, 100vw"
      />
    </div>
    <div class="container flex-column gap-md">
      <h1 class="hero-title">
        <span v-animate:reveal class="reveal"
          ><span>{{ title }}</span></span
        >
      </h1>

      <div class="grid gap-xl">
        <div
          v-animate
          class="col-xs-12 col-md-8 col-xl-6 container flex-column"
        >
          <h4 v-for="block in texts" :key="block._key">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ block.content }}
          </h4>
        </div>
      </div>
      <slot />
    </div>
    <Tab v-if="table" :columns="table.columns" :rows="table.rows" />
  </section>
</template>
