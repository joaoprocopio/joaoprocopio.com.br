<script setup lang="ts">
type Link = {
  label: string
  href: string
}

const links: Link[] = [
  {
    label: 'home',
    href: '/',
  },
  {
    label: 'blog',
    href: '/blog',
  },
  {
    label: 'projects',
    href: '/projects',
  },
]
</script>

<template>
  <div class="mx-auto my-12 max-w-3xl space-y-8 px-6">
    <div class="space-y-2">
      <hgroup>
        <h1 class="text-2xl font-semibold">
          <a href="/">joão procópio</a>
        </h1>
      </hgroup>

      <ul class="[&>li+li::before]:mx-2 [&>li+li::before]:content-['/']">
        <li v-for="link in links" class="inline">
          <a :href="link.href">{{ link.label }}</a>
        </li>
      </ul>
    </div>

    <div></div>
  </div>
</template>
