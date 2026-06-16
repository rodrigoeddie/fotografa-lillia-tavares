<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface Cliente { id: number; nome: string; email: string; celular: string | null; bg_image: string | null; criado_em: string; }

const cfImg = useCfImg();

const clientes = ref<Cliente[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    clientes.value = await adminFetch<Cliente[]>('/api/admin/clientes');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteCliente(id: number, nome: string) {
  if (!confirm(`Excluir "${nome}"? Todas as sessões vinculadas serão removidas.`)) return;
  try {
    await adminFetch(`/api/admin/clientes/${id}`, { method: 'DELETE' });
    showMessage('Cliente removido', 'success');
    clientes.value = clientes.value.filter((c) => c.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div class="row aic">
        <span class="material-symbols-outlined"> person_3 </span>
        <h2>
          <span>Clientes</span>
        </h2>
        <p class="dep-meta"> - {{ clientes.length }} clientes</p>
      </div>
      <NuxtLink to="/admin/clientes/save" class="btn-add-item">
        <span class="material-symbols-outlined"> person_add </span>
        <span>Novo cliente</span>
      </NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="clientes.length === 0" class="list-empty">Nenhum cliente cadastrado.</p>
    <div v-else class="item-list wrap">
      <div v-for="c in clientes" :key="c.id" class="item-row item-300 wrap">
        <NuxtLink :to="`/admin/clientes/save/${c.id}`" class="link-row" title="Editar">
          <nuxt-img
            v-if="c.bg_image"
            class="item-thumb"
            :src="cfImg(c.bg_image)"
            format="webp"
            width="70"
            placeholder
            loading="lazy"
          />
          <div v-else class="item-thumb item-thumb--placeholder">
            <span class="material-symbols-outlined"> photo </span>
          </div>
          <div class="item-info">
            <span class="item-title">{{ c.nome }}</span>
            <span class="item-sub">{{ c.email }}</span>
            <span v-if="c.celular" class="item-sub">
              <span class="material-symbols-outlined"> call </span>
              <span>{{ c.celular }}</span>
            </span>
          </div>
          <!-- <span class="item-meta">{{ c.criado_em }}</span> -->
        </NuxtLink>
        <div class="item-actions">
          <NuxtLink :to="`/admin/sessoes/save?cliente_id=${c.id}`" class="btn-icon btn-fotos" title="Nova sessão">
            <span class="material-symbols-outlined">camera_alt</span>
            <span>Nova sessão</span>
          </NuxtLink>
          <button class="btn-icon btn-danger" title="Excluir" @click="deleteCliente(c.id, c.nome)">
            <span class="material-symbols-outlined">delete</span>
            <span>Deletar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.item-info {
  .material-symbols-outlined {
    padding-right: 4px;
    font-size: 12px;
    top: 3px;
  }
}

.item-thumb {
  width: 70px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
  background: #2a2a2a;
  &--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    border: 1px solid #333;
  }
}
</style>
