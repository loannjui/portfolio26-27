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
    <thead role="rowgroup">
      <tr class="grid gap-xl" role="row">
        <th
          v-for="col in columns"
          :key="col._key"
          :class="cellClass"
          scope="col"
          role="columnheader"
        >
          {{ col.name }}
        </th>
      </tr>
    </thead>
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
  text-transform: uppercase;
  th {
    color: var(--color-light-bg);
    text-align: left;
  }
}

thead {
  display: block;
    padding-top: 1rem;
  margin-bottom: 0.5rem;
}

tbody {
  display: grid;
  gap: 0.5rem;
}

th,
td {
  padding: 0;
  line-height: 1;
  font-weight: 700;
}
</style>
