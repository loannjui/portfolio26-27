<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import Button from "./Button.vue";
import { sanity } from "../../services/sanity.js";
import { useJsonStorage } from "../../composables/useJsonStorage.js";
import { IMAGE } from "../../services/queries.js";
import { imageUrl } from "../../services/image.js";
import SanityImage from "./SanityImage.vue";

// The logo never renders wider than the navbar slot
const LOGO_WIDTH = 240;

const nav = ref(null);
const navEl = ref(null);
const error = ref(null);
const menuOpen = ref(false);
const scrolled = ref(false);
const hoverSuppressed = ref(false);

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
  if (theme.value === "dark" && nav.value?.logoDark) {
    return { source: nav.value.logoDark, alt: nav.value.logoDarkAlt };
  }

  return { source: nav.value?.logo, alt: nav.value?.logoAlt };
});

// The dark logo is preloaded so switching theme does not blink
const darkLogoUrl = computed(() =>
  nav.value?.logoDark
    ? imageUrl(nav.value.logoDark, { width: LOGO_WIDTH })
    : "",
);

const route = useRoute();

// NAV functions
function linkTo(slug) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

// Desktop pointers open the menu on hover; touch and mobile keep the click
function hoverEnabled() {
  return window.matchMedia("(min-width: 1040px) and (hover: hover)").matches;
}

let closeTimer;

function toggleMenu() {
  clearTimeout(closeTimer);
  menuOpen.value = !menuOpen.value;
  // Clicking close while still on the button: drop the hover styling too,
  // until the pointer actually leaves and comes back
  hoverSuppressed.value = !menuOpen.value && hoverEnabled();
}

function onMenuEnter() {
  if (!hoverEnabled()) return;
  clearTimeout(closeTimer);
  hoverSuppressed.value = false;
  menuOpen.value = true;
}

// Small grace period so the gap between the button and the panel is crossable
function onMenuLeave() {
  hoverSuppressed.value = false;
  if (!hoverEnabled()) return;
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    menuOpen.value = false;
  }, 150);
}

// Collapse the nav links into the menu button once the page is scrolled
function onScroll() {
  const next = window.scrollY > 32;
  if (next === scrolled.value) return;
  scrolled.value = next;
  if (!next) menuOpen.value = false;
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
  clearTimeout(closeTimer);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("keydown", onKeydown);
  document.removeEventListener("pointerdown", onPointerDown);
});

onMounted(async () => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
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
      "logo": logo->image${IMAGE},
      "logoAlt": logo->alt,
      "logoDark": logoDark->image${IMAGE},
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
  <nav ref="navEl" :data-scrolled="scrolled" v-animate:fade>
    <RouterLink to="/" class="logo">
      <SanityImage
        :source="logo.source"
        :alt="logo.alt"
        :width="LOGO_WIDTH"
        sizes="240px"
        loading="eager"
      />
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
      :class="{ 'no-hover': hoverSuppressed }"
      :variant="menuOpen ? 'filled' : 'stroke'"
      :swapped="menuOpen"
      aria-controls="mobile-menu"
      :aria-expanded="menuOpen ? 'true' : 'false'"
      @click="toggleMenu"
      @mouseenter="onMenuEnter"
      @mouseleave="onMenuLeave"
    >
      Menu
      <span class="icon-burger" aria-hidden="true"></span>
      <template #alt
        >Close
        <span class="icon-close" aria-hidden="true"></span>
      </template>
    </Button>

    <ul
      id="mobile-menu"
      :class="{ 'is-open': menuOpen }"
      @mouseenter="onMenuEnter"
      @mouseleave="onMenuLeave"
    >
      <li v-for="item in nav?.items" :key="item._key">
        <RouterLink :to="linkTo(item.slug)" class="nav-link">
          {{ item.label }}
          <span class="nav-arrow icon-arrow" aria-hidden="true"></span>
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

  <link v-if="darkLogoUrl" rel="preload" as="image" :href="darkLogoUrl" />
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
}

.links {
  display: none;
}

#mobile-menu {
  display: flex;
  flex-direction: column;
  width: calc(100% - 2rem);
  right: 1rem;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-0.5rem);
  transition: all var(--transi-fast) var(--bezier-a);
  position: absolute;
  top: 4.75rem;
  gap: 0.5rem;
  background-color: var(--color-menu);
  border-radius: var(--border-radius);
  padding: 2rem;

  li a {
    font-size: clamp(1.2rem, 1.4vw, 1.5rem);
    font-weight: 700;
    color: var(--color-main-bg);
    span {
      font-size: 0.65em;
    }
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

.menu-toggle.no-hover :deep(.btn-content) {
  pointer-events: none;
}

.nav-link:hover .nav-arrow,
.nav-link:focus-visible .nav-arrow {
  transform: rotate(-90deg);
}

@media (min-width: 1040px) {
  .links,
  .menu-toggle {
    transition:
      transform var(--transi-fast) var(--bezier-a),
      visibility var(--transi-fast) var(--bezier-a);
  }

  .links {
    display: flex;
    gap: 2.5rem;
    transition-delay: var(--stagger);
  }

  .menu-toggle {
    display: inline-flex;
    position: absolute;
    top: 1rem;
    right: 1rem;
    visibility: hidden;
    transform: translateY(calc(-100% - 1rem));
    transition-delay: 0s;
  }

  #mobile-menu,
  #mobile-menu.is-open {
    display: none;
  }

  nav[data-scrolled="true"] .links {
    visibility: hidden;
    transform: translateY(calc(-100% - 1rem));
    transition-delay: 0s;
  }

  nav[data-scrolled="true"] .menu-toggle {
    visibility: visible;
    transform: translateY(0);
    transition-delay: var(--stagger);
  }

  nav[data-scrolled="true"] #mobile-menu {
    display: flex;
    width: 25%;
    right: 1.5rem;
  }
}
</style>
