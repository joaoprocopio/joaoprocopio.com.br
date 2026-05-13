<script setup lang="ts">
useHead({
  titleTemplate(title) {
    const name = 'joão procópio'

    return title ? `${title} | ${name}` : name
  },
})
</script>

<template>
  <ColorScheme>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ColorScheme>
</template>
