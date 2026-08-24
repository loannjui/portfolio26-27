<script setup>
import { computed, ref, onMounted } from 'vue'
import { sanity } from '../services/sanity'

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
    page.value = await sanity.fetch(query)
  } catch (err) {
    error.value = err
  }
})
</script>

<template>
  <p v-if="error" role="alert">Le contenu n’a pas pu être chargé.</p>

  <section v-else-if="hero" class="hero">
    <h1>
      {{ hero.title }}
      <span v-if="hero.subtitle" class="hero-subtitle">{{ hero.subtitle }}</span>
    </h1>
  </section>
</template>

<style scoped>
.hero-subtitle {
  display: block;
}
</style>
