<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const router = useRouter();

interface Entrega {
  id: number; sessao_id: number; r2_key: string | null; nome_arquivo: string | null;
  bg_image_id: string | null; mensagem: string | null; ativo: number;
  nome_sessao?: string; cliente_nome?: string;
}

const entregas = ref<Entrega[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    entregas.value = await adminFetch<Entrega[]>('/api/admin/entregas');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

function copyLink(sessaoId: number) {
  const url = `${window.location.origin}/area-cliente/entrega/${sessaoId}`;
  navigator.clipboard.writeText(url).then(() => showMessage('Link copiado!', 'success'));
}

async function deleteEntrega(e: Entrega) {
  if (!confirm(`Excluir entrega de "${e.nome_sessao}"?`)) return;
  try {
    await adminFetch(`/api/admin/entregas/${e.sessao_id}`, { method: 'DELETE' });
    entregas.value = entregas.value.filter((x) => x.sessao_id !== e.sessao_id);
    showMessage('Entrega removida', 'success');
  } catch (err: any) {
    showMessage('Erro: ' + (err.statusMessage || err.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <h2>Entregas de Ensaio</h2>
        <p class="dep-meta">{{ entregas.length }} entregas</p>
      </div>
      <NuxtLink to="/admin/entregas/save" class="btn-add-item">
        <span class="material-symbols-outlined"> add </span>
        <span>Nova entrega</span>
      </NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="entregas.length === 0" class="list-empty">Nenhuma entrega cadastrada.</p>
    <div v-else class="item-list">
      <div v-for="e in entregas" :key="e.sessao_id" class="item-row">
        <NuxtLink :to="`/admin/entregas/save/${e.id}`" class="link-row" title="Editar">
          <div class="item-info">
            <span class="item-title">{{ e.nome_sessao }}</span>
            <span class="item-sub">{{ e.cliente_nome }}</span>
          </div>
          <span class="item-meta">{{ e.nome_arquivo ?? '—' }}</span>
        </NuxtLink>
        <span class="status-pill" :class="e.ativo ? 'active' : 'inactive'">
          {{ e.ativo ? '🟢 Ativa' : '🔴 Inativa' }}
        </span>
        <div class="item-actions">
          <button class="btn-icon" title="Copiar link do cliente" @click="copyLink(e.sessao_id)">🔗</button>
          <button class="btn-icon btn-danger" title="Excluir" @click="deleteEntrega(e)">🗑 Deletar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
