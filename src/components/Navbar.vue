<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import Button from "./Button.vue";
import { sanity } from "../services/sanity";
import { useJsonStorage } from "../composables/useJsonStorage.js";

const nav = ref(null);
const error = ref(null);
const menuOpen = ref(false);

// Le composable relit la valeur au montage et la réécrit à chaque changement
const { data: theme } = useJsonStorage("theme", "light");

// Garde l'attribut data-theme du <html> aligné sur la valeur stockée
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

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
});

onMounted(async () => {
  window.addEventListener("keydown", onKeydown);
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
  <nav aria-label="Navigation principale">
    <RouterLink to="/" class="logo">
      <img v-if="logo.url" :src="logo.url" :alt="logo.alt" />
    </RouterLink>

    <div class="links">
      <ul>
        <li v-for="item in nav?.items" :key="item._key">
          <RouterLink :to="linkTo(item.slug)" class="nav-link">
            {{ item.label }}
            <svg
              class="nav-arrow"
              width="11"
              height="10"
              viewBox="0 0 11 10"
              fill="none"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.042 4.52051L5.68262 9.04102L4.60254 8L7.23438 5.27051H0V3.77051H7.23438L4.60254 1.04102L5.68262 0L10.042 4.52051Z"
                fill="currentColor"
              />
            </svg>
          </RouterLink>
        </li>
      </ul>
      <Button variant="filled" :swapped="theme === 'dark'" @click="toggleTheme">
        Dark
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.15993 1.48C9.81993 2.52 10.2099 3.75 10.2099 5.08C10.2099 8.79 7.20993 11.79 3.49993 11.79C2.95993 11.79 2.42993 11.72 1.92993 11.6C3.11993 13.36 5.13993 14.52 7.42993 14.52C11.0999 14.52 14.0699 11.55 14.0699 7.88C14.0699 4.81 11.9899 2.24 9.15993 1.48Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
          />
        </svg>

        <template #alt
          >Light
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_22_903)">
              <path
                d="M8 5.5C9.38 5.5 10.5 6.62 10.5 8C10.5 9.38 9.38 10.5 8 10.5C6.62 10.5 5.5 9.38 5.5 8C5.5 6.62 6.62 5.5 8 5.5ZM8 4C5.79 4 4 5.79 4 8C4 10.21 5.79 12 8 12C10.21 12 12 10.21 12 8C12 5.79 10.21 4 8 4Z"
                fill="currentColor"
              />
              <path d="M8.75 0H7.25V3H8.75V0Z" fill="currentColor" />
              <path
                d="M2.86803 1.80901L1.80737 2.86967L3.92869 4.99099L4.98935 3.93033L2.86803 1.80901Z"
                fill="currentColor"
              />
              <path d="M3 7.25H0V8.75H3V7.25Z" fill="currentColor" />
              <path
                d="M3.93406 11.0144L1.81274 13.1357L2.8734 14.1964L4.99472 12.0751L3.93406 11.0144Z"
                fill="currentColor"
              />
              <path d="M8.75 13H7.25V16H8.75V13Z" fill="currentColor" />
              <path
                d="M12.0687 11.009L11.0081 12.0697L13.1294 14.191L14.19 13.1303L12.0687 11.009Z"
                fill="currentColor"
              />
              <path d="M16 7.25H13V8.75H16V7.25Z" fill="currentColor" />
              <path
                d="M13.124 1.80362L11.0027 3.92494L12.0633 4.9856L14.1847 2.86428L13.124 1.80362Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0_22_903">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
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
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 4L14 4M2 8L14 8M2 12L14 12"
          stroke="currentColor"
          stroke-width="1.5"
        />
      </svg>
      <template #alt
        >Close
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.03039 3L13.0304 13M12.9697 3L2.96973 13"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
      </template>
    </Button>

    <ul id="mobile-menu" :class="{ 'is-open': menuOpen }">
      <li v-for="item in nav?.items" :key="item._key">
        <RouterLink :to="linkTo(item.slug)" class="nav-link">
          {{ item.label }}
          <svg
            width="22"
            height="19"
            viewBox="0 0 22 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.1998 9.04102L11.9966 18.082L9.71647 16L15.2726 10.541H0V7.54102H15.2726L9.71647 2.08203L11.9966 0L21.1998 9.04102Z"
              fill="currentColor"
            />
          </svg>
        </RouterLink>
      </li>
      <li>
        <Button
          variant="filled"
          :swapped="theme === 'dark'"
          @click="toggleTheme"
        >
          Dark
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.15993 1.48C9.81993 2.52 10.2099 3.75 10.2099 5.08C10.2099 8.79 7.20993 11.79 3.49993 11.79C2.95993 11.79 2.42993 11.72 1.92993 11.6C3.11993 13.36 5.13993 14.52 7.42993 14.52C11.0999 14.52 14.0699 11.55 14.0699 7.88C14.0699 4.81 11.9899 2.24 9.15993 1.48Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-miterlimit="10"
            />
          </svg>

          <template #alt
            >Light
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_22_903)">
                <path
                  d="M8 5.5C9.38 5.5 10.5 6.62 10.5 8C10.5 9.38 9.38 10.5 8 10.5C6.62 10.5 5.5 9.38 5.5 8C5.5 6.62 6.62 5.5 8 5.5ZM8 4C5.79 4 4 5.79 4 8C4 10.21 5.79 12 8 12C10.21 12 12 10.21 12 8C12 5.79 10.21 4 8 4Z"
                  fill="currentColor"
                />
                <path d="M8.75 0H7.25V3H8.75V0Z" fill="currentColor" />
                <path
                  d="M2.86803 1.80901L1.80737 2.86967L3.92869 4.99099L4.98935 3.93033L2.86803 1.80901Z"
                  fill="currentColor"
                />
                <path d="M3 7.25H0V8.75H3V7.25Z" fill="currentColor" />
                <path
                  d="M3.93406 11.0144L1.81274 13.1357L2.8734 14.1964L4.99472 12.0751L3.93406 11.0144Z"
                  fill="currentColor"
                />
                <path d="M8.75 13H7.25V16H8.75V13Z" fill="currentColor" />
                <path
                  d="M12.0687 11.009L11.0081 12.0697L13.1294 14.191L14.19 13.1303L12.0687 11.009Z"
                  fill="currentColor"
                />
                <path d="M16 7.25H13V8.75H16V7.25Z" fill="currentColor" />
                <path
                  d="M13.124 1.80362L11.0027 3.92494L12.0633 4.9856L14.1847 2.86428L13.124 1.80362Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_22_903">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
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
  display: flex;
  position: fixed;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  justify-content: space-between;
  padding: 1rem 5rem;
  flex-wrap: wrap;

  @media (max-width: 64rem) {
    padding: 1rem;
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
  transition: all var(--transition-main);
  position: absolute;
  top: 5.75rem;
  gap: 0.5rem;
  background-color: var(--color-light-light-bg);
  border-radius: 10px;
  padding: 2rem;

  li a {
    font-size: 1.5rem;
    font-weight: 600;
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
  gap: 2.5rem;
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
  transition: transform var(--transition-main);
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
