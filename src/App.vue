<script setup>
import { nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "./components/General/Navbar.vue";

// Safety net
const FADE_TIMEOUT = 1000;

const router = useRouter();
const mainEl = ref(null);
const leaving = ref(false);

function fadeOut() {
  return new Promise((resolve) => {
    const el = mainEl.value;
    if (!el) return resolve();

    function done() {
      clearTimeout(safety);
      el.removeEventListener("transitionend", onEnd);
      resolve();
    }

    function onEnd(event) {
      if (event.target === el && event.propertyName === "opacity") done();
    }

    const safety = setTimeout(done, FADE_TIMEOUT);
    el.addEventListener("transitionend", onEnd);
  });
}

router.beforeEach(async (to, from) => {
  if (!from.name || to.path === from.path) return;

  leaving.value = true;
  await nextTick();
  await fadeOut();
});

router.afterEach(() => {
  leaving.value = false;
});
</script>

<template>
  <Navbar />
  <main
    ref="mainEl"
    class="container flex-column"
    :class="{ 'is-leaving': leaving }"
  >
    <RouterView />
  </main>
</template>

<style scoped>
main {
  transition: opacity var(--transi-quick) var(--bezier-o);
}

main.is-leaving {
  opacity: 0;
}
</style>
