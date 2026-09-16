<script setup>
import { computed } from "vue";
import ContactForm from "./ContactForm.vue";
import Tab from "../General/Tab.vue";
import { useSanityQuery } from "../../composables/useSanityQuery.js";
import { mediaByTitleQuery } from "../../services/queries.js";

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
  // Name of the media document shown behind the section
  imageName: {
    type: String,
    default: "Background_contact",
  },
});

const { data: image } = useSanityQuery(mediaByTitleQuery, {
  title: props.imageName,
});

const texts = computed(() =>
  props.content.filter((b) => b._type === "textBlock"),
);
const table = computed(() => props.content.find((b) => b._type === "table"));
</script>

<template>
  <div class="contact-wrapper">
    <section v-animate id="contact" class="grid gap-xl">
      <div class="col-xs-12 col-xl-12 container flex-column gap-md">
        <h2>{{ title }}</h2>
        <div class="separator" />
      </div>
      <div class="col-xs-12 col-xl-6">
        <p v-animate v-for="block in texts" :key="block._key">
          {{ block.content }}
        </p>
      </div>
      <div class="col-xs-12 col-xl-6">
        <ContactForm />
      </div>
      <div class="col-xs-12 col-xl-12">
        <Tab
          v-if="table"
          :columns="table.columns"
          :rows="table.rows"
          :show-header="false"
        />
      </div>
    </section>
    <div v-if="image?.url" v-animate:fade class="background-picture">
      <img :src="image.url" :alt="image.alt ?? ''" />
    </div>
  </div>
</template>

<style scoped>
.contact-wrapper {
  position: relative;
  padding-bottom: var(--picture-offset);
}

#contact {
  position: relative;
  z-index: 1;
  background-color: var(--color-contact);
  color: var(--color-contact-text);
  border-radius: 0.5rem;
  padding: 1.5rem 1rem;
  :deep(a) {
    color: var(--color-contact-text);
  }
  :deep(table) {
    border-top: 1px solid var(--color-contact-text);
  }
  @media (min-width: 768px) {
    padding: 2rem;
  }
}

#contact .separator {
  background-color: var(--color-contact-text) !important;
}

.background-picture {
  position: absolute;
  z-index: 0;
  top: var(--picture-offset);
  right: 0;
  bottom: 0;
  left: calc(-1 * var(--page-padding));
  pointer-events: none;
}

.background-picture img {
  display: block;
  width: calc(100% + var(--page-padding));
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: invert(0);
  transition: filter var(--transi-fast) var(--bezier-o);

  [data-theme="dark"] & {
    filter: invert(1);
  }
}
</style>
