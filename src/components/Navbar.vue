<script setup>
import { computed, ref, onMounted } from "vue";
import Button from "./Button.vue";
import { sanity } from "../services/sanity";

const nav = ref(null);
const error = ref(null);
const theme = ref("light");

const logo = computed(() => {
  if (theme.value === "dark" && nav.value?.logoDarkUrl) {
    return { url: nav.value.logoDarkUrl, alt: nav.value.logoDarkAlt };
  }

  return { url: nav.value?.logoUrl, alt: nav.value?.logoAlt };
});

function linkTo(slug) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

function toggleTheme() {
  const html = document.documentElement;
  theme.value = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = theme.value;
}

onMounted(async () => {
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

  theme.value = document.documentElement.dataset.theme || "light";

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

      <Button variant="filled" @click="toggleTheme">
        {{ theme === "light" ? "Dark" : "Light" }}
      </Button>
    </div>
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
  top: 0;
  left: 0;
  width: 100%;
  justify-content: space-between;
  padding: 1rem 5rem;
}

.links {
  display: flex;
  gap: 2.5rem;
}

nav ul {
  display: flex;
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
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.nav-link:hover .nav-arrow,
.nav-link:focus-visible .nav-arrow {
  transform: rotate(-90deg);
}

@media (prefers-reduced-motion: reduce) {
  .nav-arrow {
    transition: none;
  }
}
</style>
