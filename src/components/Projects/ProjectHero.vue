<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import Button from "../General/Button.vue";
import Tab from "../General/Tab.vue";

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
  coverUrl: {
    type: String,
    default: "",
  },
});

const router = useRouter();

// Back to wherever they came from, or to the projects list when the page was
// opened directly (shared link, new tab): there is no history to pop then
function goBack() {
  if (window.history.state?.back) router.back();
  else router.push("/projects");
}

const columns = [
  { _key: "skills", name: "Skills" },
  { _key: "category", name: "Category" },
];

// The skills go down the first column, the category sits on the first row of
// the second one. A project with a category but no skill still gets its row.
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

      <img
        v-if="coverUrl"
        v-animate:fade
        class="img-responsive"
        :src="coverUrl"
        :alt="title"
      />
    </div>
  </section>
</template>
