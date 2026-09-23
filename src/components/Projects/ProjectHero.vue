<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import Button from "../General/Button.vue";
import Tab from "../General/Tab.vue";
import SanityImage from "../General/SanityImage.vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  excerpt: {
    type: String,
    default: "",
  },
  skills: {
    type: Array,
    default: () => [],
  },
  category: {
    type: String,
    default: "",
  },
  externalUrl: {
    type: String,
    default: "",
  },
  cover: {
    type: Object,
    default: null,
  },
});

const router = useRouter();

function goBack() {
  if (window.history.state?.back) router.back();
  else router.push("/projects");
}

const columns = [
  { _key: "skills", name: "Skills" },
  { _key: "category", name: "Category" },
];

// The skills go down the first column, the category sits on the first row of the second one.
const rows = computed(() =>
  (props.skills.length ? props.skills : [""]).map((skill, index) => ({
    _key: `row-${index}`,
    cells: [
      { _key: "skill", value: skill },
      { _key: "category", value: index === 0 ? props.category : "" },
    ],
  })),
);
</script>

<template>
  <section id="home" class="hero container flex-column flex-end gap-md">
    <Button variant="filled-round" @click="goBack">
      <span class="icon-arrow_back" aria-hidden="true"></span
    ></Button>
    <div class="grid">
      <h1 class="hero-title">
        <span v-animate:reveal class="reveal"
          ><span>{{ title }}</span></span
        >
      </h1>

      <p v-if="excerpt" v-animate>{{ excerpt }}</p>

      <Tab v-if="skills.length || category" :columns="columns" :rows="rows" />

      <Button
        v-if="externalUrl"
        v-animate
        variant="stroke"
        :href="externalUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit website
        <span class="icon-arrow small" aria-hidden="true"></span>
      </Button>

      <SanityImage
        v-animate:fade
        class="img-responsive"
        :source="cover"
        :alt="title"
        sizes="100vw"
        loading="eager"
      />
    </div>
  </section>
</template>
