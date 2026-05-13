<script setup lang="ts">
import { links } from '~/constants/nav'

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

      <nav>
        <ul class="[&>li+li::before]:mx-2 [&>li+li::before]:content-['/']">
          <li v-for="link in links" class="inline">
            <NuxtLink :href="link.href" class="underline underline-offset-4">{{
              link.label
            }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <ContentRenderer :value="writing!" />

    <footer class="space-y-4">
      <nav class="col-start-2 row-span-1">
        <ul class="[&>li+li::before]:mx-2 [&>li+li::before]:content-['/']">
          <li v-for="link in links" class="inline">
            <NuxtLink :href="link.href" class="underline underline-offset-4">{{
              link.label
            }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <p class="text-secondary-foreground">© 2026 joão procópio</p>
    </footer>
  </div>
</template>
