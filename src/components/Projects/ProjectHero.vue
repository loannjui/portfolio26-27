<script setup>
import { computed, ref } from "vue";
import Button from "../General/Button.vue";
import Tab from "../General/Tab.vue";
import SanityImage from "../General/SanityImage.vue";
import ImageLightbox from "../General/ImageLightbox.vue";

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
  externalUrlLabel: {
    type: String,
    default: "",
  },
  cover: {
    type: Object,
    default: null,
  },
});

const zoomed = ref(false);
const preview = ref("");

function zoom(event) {
  preview.value = event.currentTarget.querySelector("img")?.currentSrc ?? "";
  zoomed.value = true;
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
  <section id="project" class="hero container flex-column gap-md">
    <RouterLink v-animate to="/projects" class="back-button">
      <Button tag="span" variant="filled-round">
        <span class="icon-arrow_back" aria-hidden="true"></span
      ></Button>
    </RouterLink>
    <div class="grid gap-xl hero-content">
      <div class="col-xs-12 col-xl-6 container flex-column gap-md">
        <h1 v-animate>
          {{ title }}
        </h1>
        <div v-animate class="separator" />
        <p v-if="excerpt" v-animate>{{ excerpt }}</p>

        <Tab v-if="skills.length || category" :columns="columns" :rows="rows" />

        <Button
          v-if="externalUrl"
          v-animate
          class="website-button"
          variant="stroke"
          :href="externalUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ externalUrlLabel || "Visit website" }}
          <span class="icon-arrow small" aria-hidden="true"></span>
        </Button>
      </div>
      <div class="col-xs-12 col-xl-6 wrapper">
        <button v-if="cover" type="button" class="zoom" @click="zoom">
          <SanityImage
            v-animate
            class="img-responsive"
            :source="cover"
            :alt="title"
            sizes="100vw"
            loading="eager"
          />
        </button>
      </div>
    </div>
    <span v-animate class="icon-arrow_down small" aria-hidden="true"></span>

    <ImageLightbox
      :source="zoomed ? cover : null"
      :alt="title"
      :preview="preview"
      @close="zoomed = false"
    />
  </section>
</template>

<style scoped>
#project {
  justify-content: space-between;
  padding: 6.75rem 0 2rem;
  @media (min-width: 1440px) {
    padding: 9.75rem 0 5rem;
    min-height: 100vh;
  }
}

.back-button {
  margin-bottom: 1rem;
  @media (min-width: 1440px) {
    margin-bottom: 0;
  }
}

.back-button,
.website-button {
  align-self: flex-start;
}

.zoom {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  pointer-events: none;
  @media (min-width: 768px) {
    pointer-events: auto;
    cursor: pointer;
  }
}

.hero-content {
  align-items: center;
}
</style>
