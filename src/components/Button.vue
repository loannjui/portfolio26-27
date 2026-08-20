<script setup>
defineProps({
  variant: {
    type: String,
    default: "filled",
  },
  href: String,
});
</script>

<template>
  <a v-if="href" :href="href" class="btn">
    <span :class="['btn-content','all-caps', `btn-${variant}`]">
      <slot />
    </span>
  </a>

  <button v-else class="btn">
    <span :class="['btn-content','all-caps', `btn-${variant}`]">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.btn {
  background: transparent;
  text-decoration: none;
  border: none;
  box-shadow: none;
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-filled {
  background: var(--color-main);
  color: var(--color-main-bg);
}

.btn-content {
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
}
</style>
