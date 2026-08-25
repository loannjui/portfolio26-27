<script setup>
import { computed, ref, onMounted } from 'vue'
import { cachedFetch } from '../services/sanityCache'
import HomeHero from '../components/Home/HomeHero.vue'

const page = ref(null)
const error = ref(null)

const hero = computed(() => page.value?.sections?.[0])

onMounted(async () => {
  const query = `
    *[_type == "page" && slug.current == "/"][0]{
      title,
      sections[]{
        _key,
        title,
        subtitle
      }
    }
  `

  try {
    page.value = await cachedFetch(query)
  } catch (err) {
    error.value = err
  }
})
</script>

<template>
  <p v-if="error" role="alert">Le contenu n’a pas pu être chargé.</p>

  <HomeHero
    v-else-if="hero"
    :title="hero.title"
    :subtitle="hero.subtitle"
  />
</template>
