<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import Button from "./Button.vue";
import { sanity } from "../../services/sanity.js";
import { useJsonStorage } from "../../composables/useJsonStorage.js";

const nav = ref(null);
const navEl = ref(null);
const error = ref(null);
const menuOpen = ref(false);

const { data: theme } = useJsonStorage("theme", "light");

watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value;
  },
  { immediate: true },
);

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
}

const logo = computed(() => {
  if (theme.value === "dark" && nav.value?.logoDarkUrl) {
    return { url: nav.value.logoDarkUrl, alt: nav.value.logoDarkAlt };
  }

  return { url: nav.value?.logoUrl, alt: nav.value?.logoAlt };
});

const route = useRoute();

// NAV functions
function linkTo(slug) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function onKeydown(event) {
  if (event.key === "Escape") menuOpen.value = false;
}

// Close the menu when clicking anywhere outside the nav
function onPointerDown(event) {
  if (menuOpen.value && !navEl.value?.contains(event.target)) {
    menuOpen.value = false;
  }
}

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  document.removeEventListener("pointerdown", onPointerDown);
});

onMounted(async () => {
  window.addEventListener("keydown", onKeydown);
  document.addEventListener("pointerdown", onPointerDown);
  // Close nav when you click on a link
  watch(
    () => route.fullPath,
    () => {
      menuOpen.value = false;
    },
  );

  const query = `
    *[_type == "nav"][0]{
      "logoUrl": logo->image.asset->url,
      "logoAlt": logo->alt,
      "logoDarkUrl": logoDark->image.asset->url,
      "logoDarkAlt": logoDark->alt,
      items[defined(page->slug.current)]{
        _key,
        "label": coalesce(label, page->title),
        "slug": page->slug.current
      }
    }
  `;

  try {
    nav.value = await sanity.fetch(query);
  } catch (err) {
    error.value = err;
  }
});
</script>

<template>
  <nav ref="navEl" v-animate:fade>
    <RouterLink to="/" class="logo">
      <img v-if="logo.url" :src="logo.url" :alt="logo.alt" />
    </RouterLink>

    <div class="links">
      <ul>
        <li v-for="item in nav?.items" :key="item._key">
          <RouterLink :to="linkTo(item.slug)" class="nav-link">
            {{ item.label }}
            <span class="nav-arrow icon-arrow small" aria-hidden="true"></span>
          </RouterLink>
        </li>
      </ul>
      <Button variant="filled" :swapped="theme === 'dark'" @click="toggleTheme">
        Dark
        <span class="icon-moon" aria-hidden="true"></span>

        <template #alt
          >Light
          <span class="icon-sun" aria-hidden="true"></span>
        </template>
      </Button>
    </div>

    <Button
      class="menu-toggle"
      :variant="menuOpen ? 'stroke' : 'filled'"
      :swapped="menuOpen"
      aria-controls="mobile-menu"
      :aria-expanded="menuOpen ? 'true' : 'false'"
      @click="toggleMenu"
    >
      Menu
      <span class="icon-burger" aria-hidden="true"></span>
      <template #alt
        >Close
        <span class="icon-close" aria-hidden="true"></span>
      </template>
    </Button>

    <ul id="mobile-menu" :class="{ 'is-open': menuOpen }">
      <li v-for="item in nav?.items" :key="item._key">
        <RouterLink :to="linkTo(item.slug)" class="nav-link">
          {{ item.label }}
          <span class="icon-arrow" aria-hidden="true"></span>
        </RouterLink>
      </li>
      <li>
        <Button
          variant="stroke-inverted"
          :swapped="theme === 'dark'"
          @click="toggleTheme"
        >
          Dark
          <span class="icon-moon" aria-hidden="true"></span>

          <template #alt
            >Light
            <span class="icon-sun" aria-hidden="true"></span>
          </template>
        </Button>
      </li>
    </ul>
  </nav>

  <link
    v-if="nav?.logoDarkUrl"
    rel="preload"
    as="image"
    :href="nav.logoDarkUrl"
  />
</template>

<style scoped>
nav {
  z-index: 9999;
  display: flex;
  position: fixed;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 1rem 1.5rem;
  }

  @media (min-width: 1440px) {
    padding: 1rem 1.5rem;
  }
}

.links {
  display: none;
}

#mobile-menu {
  display: flex;
  flex-direction: column;
  width: calc(100% - 2rem);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-0.5rem);
  transition: all var(--transi-fast) var(--bezier-a);
  position: absolute;
  top: 4.75rem;
  gap: 0.5rem;
  background-color: var(--color-main);
  border-radius: var(--border-radius);
  padding: 2rem;

  li a {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-main-bg);
  }
}

#mobile-menu.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

nav ul {
  display: flex;
  padding: 0;
  list-style: none;
  gap: 3rem;
}

nav ul li a {
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
}

.nav-arrow {
  flex: none;
  transition: transform var(--transi-fast) var(--bezier-a);
}

.nav-link:hover .nav-arrow,
.nav-link:focus-visible .nav-arrow {
  transform: rotate(-90deg);
}

@media (min-width: 64rem) {
  .menu-toggle {
    display: none;
  }

  .links {
    display: flex;
    gap: 2.5rem;
  }

  #mobile-menu,
  #mobile-menu.is-open {
    display: none;
  }
}
</style>
