<script setup>
import ContactForm from "./ContactForm.vue";
import SanityImage from "../General/SanityImage.vue";
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
  imageName: {
    type: String,
    default: "Background_contact",
  },
});

const { data: image } = useSanityQuery(mediaByTitleQuery, {
  title: props.imageName,
});
</script>

<template>
  <div class="contact-wrapper">
    <ContactForm :title="title" :subtitle="subtitle" :content="content" />
    <div v-if="image?.image" v-animate:fade class="background-picture">
      <SanityImage :source="image.image" :alt="image.alt ?? ''" />
    </div>
  </div>
</template>

<style scoped>
.contact-wrapper {
  position: relative;
  padding-bottom: var(--picture-offset);
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
