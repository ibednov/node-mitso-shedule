<script setup lang="ts">
import '@unocss/reset/tailwind.css'
import './assets/styles/main.css'
import 'uno.css'

useHead({
  title: 'Расписание',
  meta: [
    { name: 'description', content: 'Расписание' },
  ],
  bodyAttrs: {
    class: 'relative',
  },
})
</script>

<template>
    <nuxt-layout>
        <nuxt-page />
    </nuxt-layout>
</template>
