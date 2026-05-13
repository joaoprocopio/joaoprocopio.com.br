<script setup lang="ts">
type Link = {
  label: string
  href: string
}

const sitemap: Link[] = [
  {
    label: 'home',
    href: '/',
  },
  {
    label: 'writing',
    href: '/writing',
  },
  {
    label: 'projects',
    href: '/projects',
  },
]

const social: Link[] = [
  {
    label: 'linkedin',
    href: 'https://www.linkedin.com/in/joao-procopio/',
  },
  {
    label: 'github',
    href: 'https://github.com/joaoprocopio/',
  },
]

const mail: string = 'joaovitorcprocopio@gmail.com'
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
          <li v-for="link in sitemap" class="inline">
            <NuxtLink :href="link.href">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <div class="space-y-2">
      <h2 class="text-xl font-medium">about</h2>
      <p>
        software engineer with 3+ years of experience, passionate about building
        distributed systems and solving complex business problems
      </p>
    </div>

    <div class="space-y-2">
      <h2 class="text-xl font-medium">writing</h2>
      <p>TODO</p>
    </div>

    <div class="space-y-2">
      <h2 class="text-xl font-medium">find me</h2>
      <ul class="[&>li+li::before]:mx-2 [&>li+li::before]:content-['/']">
        <li v-for="link in social" class="inline">
          <NuxtLink :href="link.href" target="_blank">{{
            link.label
          }}</NuxtLink>
        </li>
      </ul>
      <p>
        or mail me through
        <NuxtLink :href="'mailto:' + mail" target="_blank">
          {{ mail }}
        </NuxtLink>
      </p>
    </div>

    <footer class="space-y-2">
      <Cube class="-ml-10 size-64" />

      <nav class="col-start-2 row-span-1">
        <ul class="[&>li+li::before]:mx-2 [&>li+li::before]:content-['/']">
          <li v-for="link in sitemap" class="inline">
            <NuxtLink :href="link.href">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <p>© 2026 joão procópio</p>
    </footer>
  </div>
</template>
