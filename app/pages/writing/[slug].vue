<script setup lang="ts">
const route = useRoute()

const path = computed(() => route.path.replace('/writing', ''))

const { data: writing } = await useAsyncData(() =>
  queryCollection('writing').path(path.value).first(),
)

useSeoMeta({
  title: writing.value?.title,
  description: writing.value?.description,
})
</script>

<template>
  <div class="mx-auto my-12 max-w-2xl space-y-16 px-6">
    <ContentRenderer :value="writing!" />
  </div>
</template>
