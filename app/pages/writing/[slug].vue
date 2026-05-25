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

    <article v-if="writing" class="writing-content">
      <ContentRenderer :value="writing" />
    </article>
    <div v-else>404 not found</div>

    <footer class="space-y-4">
      <p class="text-secondary-foreground">© 2026 joão procópio</p>
    </footer>
  </div>
</template>

<style scoped>
.writing-content {
  position: relative;
}

.writing-content :deep(> * + :not(.sidenote)),
.writing-content :deep(> div > * + :not(.sidenote)) {
  margin-top: 1rem;
}

.writing-content :deep(h1) {
  color: var(--foreground);
  font-size: var(--text-2xl);
  font-weight: 500;
  line-height: var(--text-2xl--line-height);
  letter-spacing: var(--text-2xl--letter-spacing);
}

.writing-content :deep(h2) {
  color: var(--foreground);
  font-size: var(--text-xl);
  font-weight: 500;
  line-height: var(--text-xl--line-height);
  letter-spacing: var(--text-xl--letter-spacing);
}

.writing-content :deep(h3) {
  color: var(--foreground);
  font-size: var(--text-lg);
  font-weight: 500;
  line-height: var(--text-lg--line-height);
  letter-spacing: var(--text-lg--letter-spacing);
}

.writing-content :deep(p),
.writing-content :deep(li) {
  color: var(--secondary-foreground);
}

.writing-content :deep(a) {
  color: var(--foreground);
  /* text-decoration-line: underline; */
  /* text-underline-offset: 0.2em; */
}

.writing-content :deep(pre) {
  overflow-x: auto;
  border: 1px solid var(--border);
  background: var(--secondary);
  padding: 1rem;
}

.writing-content :deep(code) {
  color: var(--foreground);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
}
</style>
