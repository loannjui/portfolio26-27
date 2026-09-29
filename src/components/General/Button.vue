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
    <span :class="['btn-content', `btn-${variant}`, 'details']">
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

  .btn-content {
    transition:
      color var(--transi-fast) var(--bezier-o),
      background-color var(--transi-mid) var(--bezier-o),
      border var(--transi-mid) var(--bezier-o),
      filter var(--transi-fast) var(--bezier-o);
  }

  .btn-label span {
    transition: opacity var(--transi-fast) var(--bezier-o);
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible .btn-filled,
  &:focus-visible .btn-filled-round,
  &:focus-visible .btn-stroke,
  &:focus-visible .btn-stroke-round {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 9999px;
  }
}

.btn-filled,
.btn-filled-round {
  border: 1px solid var(--color-main);
  background: var(--color-main);
  color: var(--color-main-bg);
  filter: brightness(1);
  &:active {
    filter: brightness(1.4);
  }

  [data-theme="dark"] .btn:focus-visible &,
  [data-theme="dark"] &:active {
    filter: brightness(0.6);
  }
}

.btn-stroke,
.btn-stroke-round {
  border: 1px solid var(--color-light-light-bg);
  color: var(--color-main);
  background-color: var(--color-main-bg);
  &:active {
    border-color: var(--color-main);
    color: var(--color-main-bg);
    background: var(--color-main);
  }
}

.btn-stroke-inverted {
  border: 1px solid var(--color-main-bg);
  color: var(--color-main-bg);
  &:active {
    color: var(--color-main);
    background: var(--color-main-bg);
  }
}

.btn-contact {
  border: 1px solid var(--color-contact-text);
  color: var(--color-contact-text);
  &:active {
    color: var(--color-contact);
    background: var(--color-contact-text);
  }
}

@media (hover: hover) {
  .btn-filled:hover,
  .btn-filled-round:hover {
    filter: brightness(1.4);
  }

  [data-theme="dark"] .btn-filled:hover,
  [data-theme="dark"] .btn-filled-round:hover {
    filter: brightness(0.6);
  }

  .btn-stroke:hover,
  .btn-stroke-round:hover {
    border-color: var(--color-main);
    color: var(--color-main-bg);
    background: var(--color-main);
  }

  .btn-stroke-inverted:hover {
    color: var(--color-main);
    background: var(--color-main-bg);
  }

  .btn-contact:hover {
    color: var(--color-contact);
    background: var(--color-contact-text);
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
  gap: 0.25rem;
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
  padding: 0.33rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-filled-round.btn-content,
.btn-stroke-round.btn-content {
  display: flex;
  justify-content: center;
  font-size: 1.2rem;
  padding: 1px 0 0 0;
  width: 2.75rem;
  height: 2.75rem;
}
</style>
