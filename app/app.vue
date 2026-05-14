<script setup lang="ts">
useHead({
  titleTemplate(title) {
    const name = 'joão procópio'
    return title ? `${title} | ${name}` : name
  },
})
</script>

<template>
  <NuxtLoadingIndicator color="var(--gray-12)" />
  <NuxtRouteAnnouncer />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
