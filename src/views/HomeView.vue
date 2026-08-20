<script setup>
import { ref, onMounted } from 'vue'
import { sanity } from '../services/sanity'

const page = ref(null)

onMounted(async () => {
  const query = `
    *[_type == "page" && slug.current == "/"][0]
  `

  page.value = await sanity.fetch(query)
})
</script>

<template>
  <main v-if="page">
    <h1>{{ page.sections[0].title }}</h1>
  </main>
</template>