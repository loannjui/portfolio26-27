<script setup>
defineProps({
  variant: {
    type: String,
    default: "filled",
  },
  href: String,
  swapped: Boolean,
});
</script>

<template>
  <a v-if="href" :href="href" class="btn">
    <span :class="['btn-content', 'all-caps', `btn-${variant}`]">
      <span
        v-if="$slots.alt"
        class="btn-label"
        :class="{ 'is-swapped': swapped }"
      >
        <span><slot /></span>
        <span><slot name="alt" /></span>
      </span>
      <slot v-else />
    </span>
  </a>

  <button v-else class="btn">
    <span :class="['btn-content', 'all-caps', `btn-${variant}`]">
      <span
        v-if="$slots.alt"
        class="btn-label"
        :class="{ 'is-swapped': swapped }"
      >
        <span><slot /></span>
        <span><slot name="alt" /></span>
      </span>
      <slot v-else />
    </span>
  </button>
</template>

<style scoped>
.btn {
  cursor: pointer;
  background: transparent;
  text-decoration: none;
  padding: 0;
  border: none;
  box-shadow: none;
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  span {
    transition: color var(--transition-main), background-color var(--transition-main), border var(--transition-main);
  }
}

.btn-filled {
  border: 1px solid var(--color-main);
  background: var(--color-main);
  color: var(--color-main-bg);
}

.btn-stroke {
  border: 1px solid var(--color-main);
  color: var(--color-main);
}

.btn-label {
  display: grid;
  grid-template-columns: 1fr 0fr;
}

.btn-label.is-swapped {
  grid-template-columns: 0fr 1fr;
}

.btn-label span {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: .5rem;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: opacity var(--transition-main);
}

.btn-label > span:last-child,
.btn-label.is-swapped > span:first-child {
  opacity: 0;
}

.btn-label.is-swapped > span:last-child {
  opacity: 1;
}

.btn-content {
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
}
</style>
