<script setup lang="ts">
type Link = {
  label: string
  href: string
}

const sitemap = [
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
] as const satisfies Link[]

const social = [
  {
    label: 'linkedin',
    href: 'https://www.linkedin.com/in/joao-procopio/',
  },
  {
    label: 'github',
    href: 'https://github.com/joaoprocopio/',
  },
] as const satisfies Link[]

const mail = 'joaovitorcprocopio@gmail.com' as const

const { data: writing } = await useAsyncData(() =>
  queryCollection('writing').all(),
)
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
            <NuxtLink :href="link.href" class="underline underline-offset-4">{{
              link.label
            }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <div class="space-y-4">
      <h2 class="text-xl font-medium">about</h2>

      <p class="text-secondary-foreground">
        software engineer with 3+ years of experience, passionate about building
        distributed systems and solving complex business problems
      </p>
    </div>

    <div class="space-y-4">
      <h2 class="text-xl font-medium">writing</h2>
      <NuxtLink
        class="flex gap-4"
        v-for="post in writing"
        :to="{
          name: 'writing-slug',
          params: {
            slug: post.stem,
          },
        }">
        <NuxtImg
          class="aspect-3/2 h-40 object-cover"
          :src="post.cover.src"
          :alt="post.cover.alt" />

        <div class="flex flex-1 flex-col gap-2">
          <p class="font-medium">
            {{ post.title }}
          </p>

          <p class="text-secondary-foreground text-xs">
            {{ post.description }}
          </p>

          <p
            class="text-secondary-foreground text-xs"
            :title="formatDate(toDate(post.written_at))">
            {{ formatRelativeTime(toDate(post.written_at)) }}
          </p>
        </div>
      </NuxtLink>
    </div>

    <div class="space-y-4">
      <h2 class="text-xl font-medium">find me</h2>

      <div class="text-secondary-foreground">
        <ul class="[&>li+li::before]:mx-2 [&>li+li::before]:content-['/']">
          <li v-for="link in social" class="inline">
            <NuxtLink
              :href="link.href"
              target="_blank"
              class="underline underline-offset-4"
              >{{ link.label }}</NuxtLink
            >
          </li>
        </ul>
        <p>
          or mail me through
          <NuxtLink
            :href="'mailto:' + mail"
            target="_blank"
            class="underline underline-offset-4">
            {{ mail }}
          </NuxtLink>
        </p>
      </div>
    </div>

    <footer class="space-y-4">
      <!-- TODO: ao trocar de tema isso buga -->
      <Cube class="-ml-14 size-96" />

      <nav class="col-start-2 row-span-1">
        <ul class="[&>li+li::before]:mx-2 [&>li+li::before]:content-['/']">
          <li v-for="link in sitemap" class="inline">
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
