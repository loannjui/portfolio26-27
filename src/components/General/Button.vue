<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "filled",
  },
  href: String,
  swapped: Boolean,
  tag: String,
});

const element = computed(() => props.tag || (props.href ? "a" : "button"));
</script>

<template>
  <component :is="element" :href="href" class="btn">
    <span :class="['btn-content', `btn-${variant}`]">
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
  </component>
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
    text-transform: uppercase;
    transition:
      color var(--transi-fast) var(--bezier-o),
      background-color var(--transi-fast) var(--bezier-o),
      border var(--transi-fast) var(--bezier-o),
      opacity var(--transi-fast) var(--bezier-o);
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible .btn-filled,
  &:focus-visible .btn-stroke {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 9999px;
  }
}

.btn-filled {
  border: 1px solid var(--color-main);
  background: var(--color-main);
  color: var(--color-main-bg);
  &:hover {
    border-color: var(--color-accent);
    background: var(--color-accent);
  }
  &:active {
    border-color: var(--color-strong-accent);
    background: var(--color-strong-accent);
  }

  [data-theme="dark"] &:hover,
  [data-theme="dark"] &:focus,
  [data-theme="dark"] &:active {
    color: var(--color-main);
  }
}

.btn-stroke {
  border: 1px solid var(--color-main);
  color: var(--color-main);
  background-color: var(--color-main-bg);
  &:hover {
    color: var(--color-main-bg);
    background: var(--color-main);
  }
  &:active {
    border-color: var(--color-placeholder);
    background: var(--color-placeholder);
  }
}

.btn-stroke-inverted {
  border: 1px solid var(--color-main-bg);
  color: var(--color-main-bg);
  &:hover {
    color: var(--color-main);
    background: var(--color-main-bg);
  }
  &:active {
    border-color: var(--color-light-light-bg);
    background: var(--color-light-light-bg);
  }
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
  gap: 0.5rem;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
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
  padding: 0.33rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
