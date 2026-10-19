<script setup>
import { computed } from "vue";
import Button from "../General/Button.vue";
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

const blocks = computed(() =>
  (props.content ?? []).reduce((list, block) => {
    const previous = list[list.length - 1];
    if (block._type === "button" && previous) {
      previous.buttons.push(block);
    } else {
      list.push({ ...block, buttons: block._type === "button" ? [block] : [] });
    }
    return list;
  }, []),
);

function columnClass(block) {
  if (block._type === "table") return "col-xs-12";
  if (block._type === "embed") return "col-xs-12 col-xl-8";
  if (block._type === "reference" && block.caption) return "col-xs-12 col-xl-8";
  if (block._type === "spacer")
    return "col-xs-12 col-md-6 col-xl-4 spacer-desktop";
  return "col-xs-12 col-md-6 col-xl-4";
}
</script>

<template>
  <section class="container flex-column gap-xl pad-section">
    <header v-if="title || subtitle" class="container flex-column gap-sm">
      <p v-if="subtitle" v-animate class="details all-caps">{{ subtitle }}</p>
      <h3 v-if="title" v-animate>
        {{ title }}<sup class="details">{{ number }}</sup>
      </h3>
      <div v-animate class="separator" />
    </header>

    <div class="grid gap-xl">
      <div
        v-for="block in blocks"
        :key="block._key"
        :class="columnClass(block)"
      >
        <template v-if="block._type === 'textBlock'">
          <h4 v-if="block.title" v-animate>{{ block.title }}</h4>
          <p v-if="block.content" v-animate>{{ block.content }}</p>
        </template>

        <figure
          v-else-if="block._type === 'reference' && block.image"
          v-animate
        >
          <SanityImage
            class="img-responsive"
            :source="block.image"
            :alt="block.alt ?? ''"
            :sizes="
              block.caption
                ? '(min-width: 1440px) 67vw, 100vw'
                : '(min-width: 1440px) 33vw, 100vw'
            "
          />
          <figcaption v-if="block.caption" class="details">
            {{ block.caption }}
          </figcaption>
        </figure>

        <figure v-else-if="block._type === 'embed' && block.url" v-animate>
          <iframe
            :src="block.url"
            :title="block.title"
            :style="{ aspectRatio: block.aspectRatio }"
            loading="lazy"
            allowfullscreen
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

        <div v-if="block.buttons.length" class="buttons container gap-md">
          <Button
            v-for="button in block.buttons"
            :key="button._key"
            v-animate
            variant="stroke"
            :href="button.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ button.label }}
            <span class="icon-arrow small" aria-hidden="true"></span>
          </Button>
        </div>
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

.spacer-desktop {
  display: none;
  @media (min-width: 1440px) {
    display: block;
  }
}

figure img {
  width: 100%;
}

figure iframe {
  display: block;
  width: 100%;
  border: 0;
}

figcaption {
  margin-top: 0.5rem;
  color: var(--color-lgt-txt);
}
</style>
