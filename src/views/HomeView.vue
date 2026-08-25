<script setup>
import { computed } from 'vue'
import { useSanityQuery } from '../composables/useSanityQuery.js'
import HomeHero from '../components/Home/HomeHero.vue'
import HomeProjects from '../components/Home/HomeProjects.vue'

const query = `
  *[_type == "page" && slug.current == "/"][0]{
    title,
    sections[]{
      _key,
      _type,
      title,
      subtitle,
      content[]{
        _key,
        _type,
        _type == "textBlock" => { title, content },
        _type == "reference" => {
          "url": @->image.asset->url,
          "alt": @->alt,
          "caption": @->caption
        }
      }
    }
  }
`

const { data: page, error } = useSanityQuery(query)

const hero = computed(() => page.value?.sections?.[0])
</script>

<template>
  <p v-if="error" role="alert">Le contenu n’a pas pu être chargé.</p>

  <HomeHero
    v-else-if="hero"
    :title="hero.title"
    :subtitle="hero.subtitle"
    :content="hero.content"
  />
</template>
