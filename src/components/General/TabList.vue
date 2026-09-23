<script setup>
import { computed, ref } from "vue";
import { resolveLink } from "../../services/links.js";
import SanityImage from "./SanityImage.vue";

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
});

const count = computed(() => props.columns.length);

// Widths of each column, in grid units (12 total)
const COL_WIDTHS = [3, 6, 3];

const cellClass = (index) => `col-xs-12 col-xl-${COL_WIDTHS[index] ?? 12}`;

// Only the middle column reveals the image
const PREVIEW_COLUMN = 1;

const linkedRows = computed(() =>
  props.rows.map((row) => ({
    ...row,
    cells: (row.cells ?? []).map((cell) => ({
      ...cell,
      link: resolveLink(cell.link),
    })),
  })),
);

// Desktop only: the hovered row's image follows the cursor
const preview = ref(null);
const pointer = ref({ x: 0, y: 0 });

const rowImage = (row) =>
  [...(row.cells ?? [])].reverse().find((cell) => cell.image) ?? null;

function showPreview(row, event) {
  preview.value = rowImage(row);
  movePreview(event);
}

function movePreview(event) {
  pointer.value = { x: event.clientX, y: event.clientY };
}

function hidePreview() {
  preview.value = null;
}

const previewHandlers = (row) => ({
  mouseenter: (event) => showPreview(row, event),
  mousemove: movePreview,
  mouseleave: hidePreview,
});
</script>

<template>
  <div>
    <table v-if="count" role="table">
      <tbody role="rowgroup">
        <tr
          v-animate
          v-for="row in linkedRows"
          :key="row._key"
          class="grid gap-xl"
          role="row"
        >
          <td
            v-for="(cell, index) in row.cells"
            :key="cell._key"
            :class="cellClass(index)"
            role="cell"
            v-on="index === PREVIEW_COLUMN ? previewHandlers(row) : {}"
          >
            <SanityImage
              class="cell-image"
              :source="cell.image"
              :alt="cell.imageAlt ?? ''"
              :width="900"
              sizes="(min-width: 1440px) 0px, 66vw"
            />
            <RouterLink
              v-if="cell.link?.to"
              :to="cell.link.to"
              :target="cell.link.newTab ? '_blank' : undefined"
            >
              {{ cell.value }}
            </RouterLink>
            <a
              v-else-if="cell.link?.href"
              :href="cell.link.href"
              :target="cell.link.newTab ? '_blank' : undefined"
              :rel="cell.link.newTab ? 'noopener noreferrer' : undefined"
            >
              {{ cell.value }}
            </a>
            <span v-else>{{ cell.value }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <Teleport to="body">
      <Transition name="fade">
        <SanityImage
          v-if="preview"
          class="cursor-image"
          :source="preview.image"
          :alt="preview.imageAlt ?? ''"
          :width="600"
          sizes="300px"
          :style="{ left: `${pointer.x}px`, top: `${pointer.y}px` }"
        />
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
table {
  cursor: default;
  width: 100%;
  border-collapse: collapse;
}

tbody {
  display: grid;
  gap: 0.5rem;
}

tr {
  border-top: 1px solid var(--color-light-light-bg);
  padding-top: 1rem;
  padding-bottom: 4rem;

  &:last-child {
    padding-bottom: 0;
  }
}

td {
  padding: 0;
  line-height: 1;
}

td:nth-child(1) {
  font-size: clamp(0.75rem, 0.625vw, 1.5rem);

  span {
    font-weight: 700;
  }
}

td:nth-child(2) {
  font-size: clamp(1.2rem, 1.4vw, 1.5rem);
  line-height: 1;

  span {
    font-weight: 700;
  }

  @media (min-width: 1440px) {
    font-size: clamp(1.5rem, 1.4vw, 3rem);
    line-height: 1;
  }
}

.cell-image {
  display: block;
  width: 100%;
  height: auto;
  margin-bottom: 1rem;
  border-radius: var(--border-radius);
}

.cursor-image {
  display: none;
}

@media (max-width: 1439px) {
  td:nth-child(1) {
    grid-column: span 4;
  }

  td:nth-child(n + 2) {
    grid-column: 5 / -1;
  }
}

@media (min-width: 1440px) {
  .cell-image {
    display: none;
  }

  .fade-enter-active,
  .fade-leave-active {
    animation: fade-in var(--transi-fast) var(--bezier-o) both;
  }

  .fade-leave-active {
    animation-direction: reverse;
  }

  .cursor-image {
    display: block;
    border-radius: 0.5rem;
    position: fixed;
    z-index: 10;
    width: 300px;
    max-width: 100%;
    height: auto;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - 1rem));
  }
}
</style>
