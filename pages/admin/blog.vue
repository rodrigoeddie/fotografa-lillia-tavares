<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const route = useRoute();
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const fm = inject<any>('fileManager')!;

const blogEditorRef = ref<any>(null);

// Blog posts list for when no file is selected
const blogPosts = ref<{ name: string; path: string; category: string }[]>([]);
const loadingList = ref(false);

async function loadBlogPosts() {
  loadingList.value = true;
  try {
    const tree = await $fetch<{ name: string; isDirectory: boolean; children?: any[] }[]>('/api/files', {
      params: { path: 'blog' },
    });
    const posts: { name: string; path: string; category: string }[] = [];
    for (const cat of tree.filter(f => f.isDirectory)) {
      if (cat.children) {
        for (const file of cat.children) {
          if (!file.isDirectory && file.name.endsWith('.json') && file.name !== 'index.json') {
            posts.push({
              name: file.name.replace('.json', '').replace(/^\d+\./, ''),
              path: `blog/${cat.name}/${file.name}`,
              category: cat.name,
            });
          }
        }
      }
    }
    blogPosts.value = posts;
  } catch {
    // Fallback: load from file tree
    blogPosts.value = [];
  } finally {
    loadingList.value = false;
  }
}

function openPost(post: { path: string }) {
  navigateTo(`/admin/blog?file=${encodeURIComponent(post.path)}`);
}

onMounted(async () => {
  await nextTick();
  const file = route.query.file as string | undefined;
  if (file) {
    fm.selectedWork.value = file;
    await blogEditorRef.value?.openFile(file);
  } else {
    await loadBlogPosts();
  }
});

watch(() => route.query.file, async (newFile) => {
  if (newFile && typeof newFile === 'string') {
    fm.selectedWork.value = newFile;
    await nextTick();
    await blogEditorRef.value?.openFile(newFile);
  } else {
    await loadBlogPosts();
  }
});
</script>

<template>
  <div class="blog-page">
    <!-- Post list when no file selected -->
    <div v-if="!route.query.file" class="post-list-view">
      <div class="post-list-header">
        <h2>📝 Blog Posts</h2>
        <p>Selecione um post para editar ou crie um novo na barra lateral.</p>
      </div>
      <div v-if="loadingList" class="loading">Carregando...</div>
      <div v-else-if="blogPosts.length === 0" class="empty">Nenhum post encontrado.</div>
      <div v-else class="post-grid">
        <div
          v-for="post in blogPosts"
          :key="post.path"
          class="post-card"
          @click="openPost(post)"
        >
          <span class="post-cat">{{ post.category }}</span>
          <span class="post-name">{{ post.name }}</span>
        </div>
      </div>
    </div>

    <!-- Editor when file selected -->
    <AdminBlogEditor
      v-else
      ref="blogEditorRef"
      :show-message="showMessage"
    />
  </div>
</template>

<style lang="scss" scoped>
.blog-page { color: #eee; }

.post-list-view {
  .post-list-header {
    margin-bottom: 24px;
    h2 { font-size: 22px; margin-bottom: 6px; }
    p { color: #888; font-size: 14px; }
  }
}

.loading { text-align: center; padding: 40px; color: #888; }
.empty { text-align: center; padding: 40px; color: #666; }

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.post-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: #3b82f6;
    background: #1e2d3d;
  }

  .post-cat {
    display: block;
    font-size: 11px;
    color: #60a5fa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .post-name {
    display: block;
    font-size: 15px;
    color: #eee;
    font-weight: 500;
  }
}
</style>
