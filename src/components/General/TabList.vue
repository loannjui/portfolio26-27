<script setup>
import { computed } from "vue";

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

// Change col classes to match the number of tabs
const cellClass = computed(() => `col-xs-12 col-xl-${12 / count.value}`);
</script>

<template>
  <table v-if="count" role="table">
    <tbody role="rowgroup">
      <tr v-for="row in rows" :key="row._key" class="grid gap-xl" role="row">
        <td
          v-for="cell in row.cells"
          :key="cell._key"
          :class="cellClass"
          role="cell"
        >
          {{ cell.value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  border-top: 1px solid var(--color-light-light-bg);
  width: 100%;
  border-collapse: collapse;
}

tbody {
  display: grid;
  gap: 0.5rem;
}

td {
  padding: 0;
  line-height: 1;
  font-weight: 400;
}

td:nth-child(1) {
  font-size: clamp(0.75rem, 0.625vw, 1.5rem);
  font-weight: 700;
}

td:nth-child(2) {
  font-size: clamp(1.2rem, 1.4vw, 1.5rem);
  line-height: 1.1;
  font-weight: 700;

  @media (min-width: 1440px) {
    font-size: clamp(1.5rem, 1.4vw, 3rem);
    line-height: 1.15;
  }
}
</style>
