<script setup lang="ts">
const route = useRoute()
const path = computed(() => route.path.replace('/writing', ''))
const writing = await useAsyncData(() =>
  queryCollection('writing').path(route.path).first(),
)
</script>

<template>
  <div class="mx-auto my-12 max-w-2xl space-y-16 px-6">
    <pre>{{ route }}</pre>
    <pre>{{ writing }}</pre>
  </div>
</template>
