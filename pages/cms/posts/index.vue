<script setup>
const { posts } = await $fetch('/api/posts');

async function deletePost(id) {
  console.log(id);
  // const res = await $fetch('/api/posts', {
  //   method: 'DELETE',
  //   body: id
  // });

  // if(res.id == id) {}
}

const columns = [
  { key: "id", sortable: true },
  { key: "title", sortable: true },
  { key: "content", sortable: true },
  { key: "published", sortable: true },
  { key: "image", sortable: false },
  { key: "actions", width: 80 },
];
</script>

<template>
  <div>
    <h1>Lista de postagens</h1>
    <va-button to="create"> Novo </va-button>

    <template style="display: block;">
      <va-data-table
        :items="posts"
        :columns="columns"
        :item-size="46"
        virtual-scroller
        sticky-header
      >
      <template
        v-for="item in columns"
        :key="item.key"
        #[`cell(${item.key})`]="{ value, row, column }"
      >
        <span
          v-if="column.key != 'image'"
          class="table-inline__item"
        >
            {{ value }}
        </span>

        <NuxtImg
          v-if="column.key == 'image'"
          height="50"
          :src="value" />

        <va-button
          v-if="column.key == 'actions'"
          preset="plain"
          icon="delete"
          class="ml-3"
          @click="deletePost(row.itemKey.id)"
        />
      </template>
      </va-data-table>
    </template>
  </div>
</template>

<style scoped></style>
