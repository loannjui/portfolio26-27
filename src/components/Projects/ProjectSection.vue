<script setup>
import { computed } from "vue";
import Tab from "../General/Tab.vue";
import SanityImage from "../General/SanityImage.vue";

// Column placements the blocks cycle through, so they never stack up in a
// single column. Text and images walk their own rhythm: a block only ever
// shifts when another block of the same kind is added before it.
const TEXT_LAYOUTS = [
  { start: 1, span: 5 },
  { start: 7, span: 5 },
  { start: 3, span: 5 },
  { start: 6, span: 6 },
];

const IMAGE_LAYOUTS = [
  { start: 6, span: 7 },
  { start: 1, span: 6 },
  { start: 3, span: 8 },
  { start: 2, span: 5 },
];

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

function layoutFor(type, rank) {
  const layouts = type === "reference" ? IMAGE_LAYOUTS : TEXT_LAYOUTS;
  const { start, span } = layouts[rank % layouts.length];

  return { "--start": start, "--span": span };
}

// Tables are left full width; every other block gets a placement from the
// cycle of its own type.
const blocks = computed(() => {
  const ranks = {};

  return props.content.map((block) => {
    ranks[block._type] = (ranks[block._type] ?? -1) + 1;

    return {
      ...block,
      style:
        block._type === "table"
          ? null
          : layoutFor(block._type, ranks[block._type]),
    };
  });
});
</script>

<template>
  <section class="container flex-column gap-xl pad-section">
    <header v-if="title || subtitle" class="container flex-column gap-sm">
      <p v-if="subtitle" v-animate class="details all-caps">{{ subtitle }}</p>
      <h2 v-if="title" v-animate>{{ title }}</h2>
    </header>

    <div class="grid gap-xl">
      <div
        v-for="block in blocks"
        :key="block._key"
        class="block"
        :style="block.style"
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
            sizes="(min-width: 1440px) 50vw, 100vw"
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
.grid {
  align-items: start;
}

.block {
  grid-column: 1 / -1;
}

/* The placements only kick in once there is room to spread the blocks out */
@media (min-width: 1440px) {
  .block {
    grid-column: var(--start, 1) / span var(--span, 12);
  }
}

figure {
  margin: 0;
}

figcaption {
  margin-top: 0.5rem;
  color: var(--color-lgt-txt);
}
</style>
