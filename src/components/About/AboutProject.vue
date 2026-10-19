<script setup>
import Button from "../General/Button.vue";
import Tab from "../General/Tab.vue";
import SanityImage from "../General/SanityImage.vue";
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

const { texts, images, buttons } = useBlocks(() => props.content);
</script>

<template>
  <div class="grid gap-xl pad-drk">
    <div class="col-xl-6 col-xs-12">
      <section v-animate class="drk-panel grid gap-xl">
        <div class="col-xs-12 col-xl-12 container flex-column gap-md">
          <h2 v-animate>{{ title }}</h2>
          <div v-animate class="separator" />
        </div>
        <div class="col-xs-12 col-xl-12">
          <p v-animate v-for="block in texts" :key="block._key">
            {{ block.content }}
          </p>
          <div v-if="buttons.length" class="buttons container gap-md">
            <Button
              v-for="button in buttons"
              :key="button._key"
              v-animate
              variant="contact"
              :href="button.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ button.label }}
              <span class="icon-arrow small" aria-hidden="true"></span>
            </Button>
          </div>
        </div>
      </section>
    </div>
    <div class="col-xs-12 col-xl-6">
      <figure
        v-for="block in images"
        :key="block._key"
        v-show="block.image"
        v-animate
      >
        <SanityImage
          class="img-responsive"
          :source="block.image"
          :alt="block.alt ?? ''"
          sizes="(min-width: 1440px) 50vw, 100vw"
        />
      </figure>
    </div>
  </div>

</template>

<style scoped>
.grid {
  align-items: start;
}

figure {
  margin: 0;
}

@media (min-width: 1440px) {
  .pad-drk {
    align-items: stretch;
  }

  figure {
    height: 100%;
  }

  .img-responsive {
    width: 100%;
    height: 0;
    min-height: 100%;
    object-fit: cover;
  }
}
</style>
