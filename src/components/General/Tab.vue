<script setup>
import { computed } from "vue";
import { resolveLink } from "../../services/links.js";

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
});

const count = computed(() => props.columns.length);

const linkedRows = computed(() =>
  props.rows.map((row) => ({
    ...row,
    cells: (row.cells ?? []).map((cell) => ({
      ...cell,
      link: resolveLink(cell.link),
    })),
  })),
);

// Change col classes to match the number of tabs
const cellClass = computed(() => `col-xs-12 col-xl-${12 / count.value}`);
</script>

<template>
  <table v-animate v-if="count" role="table">
    <thead v-animate v-if="showHeader" role="rowgroup">
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
      <tr
        v-animate
        v-for="row in linkedRows"
        :key="row._key"
        class="grid gap-xl"
        role="row"
      >
        <td
          v-for="cell in row.cells"
          :key="cell._key"
          :class="cellClass"
          role="cell"
        >
          <img
            v-if="cell.imageUrl"
            class="cell-image"
            :src="cell.imageUrl"
            :alt="cell.imageAlt ?? ''"
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

tbody:first-child {
  padding-top: 1rem;
}

th,
td {
  padding: 0;
  line-height: 1;
}

td {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cell-image {
  width: auto;
  max-height: 1.5em;
}

@media (max-width: 1439px) {
  table {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  table:has(> tbody:first-child) {
    padding-top: 1rem;
    gap: 2rem;
  }

  thead,
  tbody,
  tr {
    display: contents;
  }

  th {
    padding-top: 1rem;
  }

  th:nth-child(1),
  td:nth-child(1) {
    order: 1;
  }

  th:nth-child(2),
  td:nth-child(2) {
    order: 2;
  }

  th:nth-child(3),
  td:nth-child(3) {
    order: 3;
  }

  th:nth-child(4),
  td:nth-child(4) {
    order: 4;
  }
}
</style>
