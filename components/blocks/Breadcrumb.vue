<script setup lang="ts">
const siteURI = 'https://fotografalilliatavares.com.br';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

const props = defineProps<{
  items: BreadcrumbItem[];
  schema?: boolean;
}>();

if (props.schema !== false) {
  useSchemaOrg([
    defineBreadcrumb({
      itemListElement: props.items.map((item, index) => ({
        '@type': 'ListItem' as const,
        position: index + 1,
        name: item.label,
        item: item.to
          ? (item.to.startsWith('http') ? item.to : siteURI + item.to)
          : undefined,
      })),
    }),
  ]);
}
</script>

<template>
  <nav aria-label="breadcrumb">
    <ul class="breadcrumb">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === items.length - 1 }"
        :aria-current="index === items.length - 1 ? 'page' : undefined"
      >
        <NuxtLink v-if="item.to && index !== items.length - 1" :to="item.to">
            {{ item.label }}
        </NuxtLink>
        <span v-else>{{ item.label }}</span>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
nav[aria-label=breadcrumb] {
  padding-top: 15rem;

  .breadcrumb {
    padding: 0 0 0 20rem;
    display: flex;

      li,
      a {
          font-size: 19rem;
          display: inline;
          color: v.$green;
          flex-shrink: 0;

          @include m.max(sm) {
              font-size: 16rem;
          }

          &.active {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-weight: bold;
            flex-shrink: initial;
            padding-right: 15rem;
          }
      }

      a:hover {
          text-decoration: underline;
      }

      li:not(:last-child)::after {
          display: inline;
          margin: 0 10rem;
          content: "→";
      }
  }
}
</style>
