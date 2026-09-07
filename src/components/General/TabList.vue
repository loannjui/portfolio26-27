<script setup>
import { computed, ref } from "vue";

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

// Desktop only: the hovered row's image follows the cursor
const preview = ref(null);
const pointer = ref({ x: 0, y: 0 });

const rowImage = (row) =>
  [...(row.cells ?? [])].reverse().find((cell) => cell.imageUrl) ?? null;

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
</script>

<template>
  <!-- Single root element, so v-animate & co. have an element to bind to -->
  <div>
    <table v-if="count" role="table">
      <tbody role="rowgroup">
        <tr
          v-for="row in rows"
          :key="row._key"
          class="grid gap-xl"
          role="row"
          @mouseenter="showPreview(row, $event)"
          @mousemove="movePreview"
          @mouseleave="hidePreview"
        >
          <td
            v-for="(cell, index) in row.cells"
            :key="cell._key"
            :class="cellClass(index)"
            role="cell"
          >
            <span>{{ cell.value }}</span>
            <img
              v-if="cell.imageUrl"
              class="cell-image"
              :src="cell.imageUrl"
              :alt="cell.imageAlt ?? ''"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <Teleport to="body">
      <Transition name="fade">
        <img
          v-if="preview"
          class="cursor-image"
          :src="preview.imageUrl"
          :alt="preview.imageAlt ?? ''"
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
}

.cursor-image {
  display: none;
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
    border-radius: .5rem;
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
