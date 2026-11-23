<script setup>
import { computed, nextTick, ref, watch } from "vue";
import Button from "./Button.vue";
import { imageSize, imageUrl } from "../../services/image.js";

const props = defineProps({
  source: {
    type: Object,
    default: null,
  },
  alt: {
    type: String,
    default: "",
  },
  preview: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close"]);

const dialog = ref(null);
const loaded = ref(false);
const closing = ref(false);

const src = computed(() => imageUrl(props.source, { width: 2560 }));
const ratio = computed(() => {
  const { width, height } = imageSize(props.source);
  return width && height ? width / height : 1;
});

watch(
  () => props.source,
  async (value) => {
    await nextTick();
    if (!dialog.value) return;
    if (value && !dialog.value.open) {
      loaded.value = false;
      closing.value = false;
      dialog.value.showModal();
      document.documentElement.style.overflow = "hidden";
    }
  },
);

function requestClose() {
  if (!dialog.value?.open || closing.value) return;
  closing.value = true;
}

function onAnimationEnd(event) {
  if (closing.value && event.target === dialog.value) dialog.value.close();
}

function onCancel(event) {
  event.preventDefault();
  requestClose();
}

function onClose() {
  closing.value = false;
  document.documentElement.style.overflow = "";
  emit("close");
}
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="lightbox"
      :class="{ 'is-closing': closing }"
      @cancel="onCancel"
      @close="onClose"
      @click="requestClose"
      @animationend="onAnimationEnd"
    >
      <Button
        class="lightbox-close"
        variant="filled-round"
        aria-label="Close"
        @click.stop="requestClose"
      >
        <span class="icon-close" aria-hidden="true"></span>
      </Button>
      <div class="lightbox-stage">
        <div
          v-if="source"
          class="lightbox-frame"
          :style="{ '--ratio': ratio }"
        >
          <img v-if="preview" :src="preview" alt="" aria-hidden="true" />
          <img
            v-if="src"
            class="lightbox-full"
            :class="{ 'is-loaded': loaded }"
            :src="src"
            :alt="alt"
            @load="loaded = true"
          />
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.lightbox {
  width: 100vw;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 4.5rem 1rem;
  border: none;
  background: transparent;
  color: var(--color-main);
  cursor: pointer;
  @media (min-width: 1440px) {
    padding: 3rem 6rem;
  }
}

.lightbox[open] {
  display: block;
}

.lightbox::backdrop {
  background-color: color-mix(in srgb, var(--black) 60%, transparent);
  backdrop-filter: blur(0.125rem);
  animation: lightbox-fade var(--transi-fast) var(--bezier-a);
}

.lightbox-stage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  container-type: size;
}

.lightbox-frame {
  position: relative;
  width: min(100cqw, 100cqh * var(--ratio));
  aspect-ratio: var(--ratio);
  overflow: hidden;
  border-radius: var(--border-radius);
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.04);
  animation: lightbox-zoom var(--transi-fast) var(--bezier-a);
}

.lightbox-frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lightbox-full {
  opacity: 0;
  transition: opacity var(--transi-quick) var(--bezier-o);
}

.lightbox-full.is-loaded {
  opacity: 1;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  animation: lightbox-fade var(--transi-fast) var(--bezier-a);
  @media (min-width: 1440px) {
    top: 2rem;
    right: 2rem;
  }
}

.lightbox.is-closing {
  animation: lightbox-hold var(--transi-quick) var(--bezier-o) forwards;
}

.lightbox.is-closing::backdrop,
.lightbox.is-closing .lightbox-close {
  animation: lightbox-fade-out var(--transi-quick) var(--bezier-o) forwards;
}

.lightbox.is-closing .lightbox-frame {
  animation: lightbox-zoom-out var(--transi-quick) var(--bezier-o) forwards;
}

@keyframes lightbox-fade {
  from {
    opacity: 0;
  }
}

@keyframes lightbox-zoom {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
}

@keyframes lightbox-fade-out {
  to {
    opacity: 0;
  }
}

@keyframes lightbox-zoom-out {
  to {
    opacity: 0;
    transform: scale(0.96);
  }
}

@keyframes lightbox-hold {
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lightbox::backdrop,
  .lightbox-frame,
  .lightbox-close {
    animation-duration: 1ms;
  }
}
</style>
