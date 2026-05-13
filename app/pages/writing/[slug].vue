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
    <header class="space-y-2">
      <hgroup>
        <h1 class="text-2xl font-medium">
          <a href="/">joão procópio</a>
        </h1>
      </hgroup>
    </header>

    <ContentRenderer v-if="writing" :value="writing" />
    <div v-else>404 not found</div>

    <footer class="space-y-4">
      <p class="text-secondary-foreground">© 2026 joão procópio</p>
    </footer>
  </div>
</template>
