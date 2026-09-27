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
  index: {
    type: Number,
    default: 0,
  },
});

const number = computed(() => String(props.index + 1).padStart(2, "0"));

// Text and images take 4 columns on desktop; captioned images and tables go full width.
function isFullWidth(block) {
  return (
    block._type === "table" ||
    (block._type === "reference" && Boolean(block.caption))
  );
}
</script>

<template>
  <section class="container flex-column gap-xl pad-section">
    <header v-if="title || subtitle" class="container flex-column gap-sm">
      <p v-if="subtitle" v-animate class="details all-caps">{{ subtitle }}</p>
      <h3 v-if="title" v-animate>
        {{ title }}<sup class="details">{{ number }}</sup>
      </h3>
      <div class="separator" />
    </header>

    <div class="grid gap-xl">
      <div
        v-for="block in content"
        :key="block._key"
        :class="isFullWidth(block) ? 'col-xs-12' : 'col-xs-12 col-xl-4'"
      >
        <template v-if="block._type === 'textBlock'">
          <h4 v-if="block.title" v-animate>{{ block.title }}</h4>
          <p v-if="block.content" v-animate>{{ block.content }}</p>
        </template>

        <figure
          v-else-if="block._type === 'reference' && block.image"
          v-animate:fade
        >
          <SanityImage
            class="img-responsive"
            :source="block.image"
            :alt="block.alt ?? ''"
            :sizes="block.caption ? '100vw' : '(min-width: 1440px) 33vw, 100vw'"
          />
          <figcaption v-if="block.caption" class="details">
            {{ block.caption }}
          </figcaption>
        </figure>

        <Tab
          v-else-if="block._type === 'table'"
          :columns="block.columns"
          :rows="block.rows"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
h3 {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  @media (min-width: 1440px) {
    gap: 0.5rem;
  }
}

h3 sup {
  vertical-align: baseline;
  line-height: 1;
}

.grid {
  align-items: start;
}

figure {
  margin: 0;
}

figure img {
  width: 100%;
}

figcaption {
  margin-top: 0.5rem;
  color: var(--color-lgt-txt);
}
</style>
