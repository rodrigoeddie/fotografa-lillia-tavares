<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const router = useRouter();

interface Entrega {
  sessao_id: number; r2_key: string | null; nome_arquivo: string | null;
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
    <div class="page-header">
      <h2>Entregas de Ensaio <span class="count-badge">{{ entregas.length }}</span></h2>
      <NuxtLink to="/admin/entregas/save" class="btn-primary">+ Nova entrega</NuxtLink>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else-if="entregas.length === 0" class="empty-hint">Nenhuma entrega cadastrada.</div>

    <table v-else class="data-table">
      <thead>
        <tr><th>Sessão</th><th>Cliente</th><th>Arquivo</th><th>Status</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="e in entregas" :key="e.sessao_id">
          <td>{{ e.nome_sessao }}</td>
          <td>{{ e.cliente_nome }}</td>
          <td class="text-sm text-muted">{{ e.nome_arquivo ?? '—' }}</td>
          <td>
            <span class="status-pill" :class="e.ativo ? 'active' : 'inactive'">
              {{ e.ativo ? '🟢 Ativa' : '🔴 Inativa' }}
            </span>
          </td>
          <td class="actions-cell">
            <button class="btn-icon" title="Copiar link do cliente" @click="copyLink(e.sessao_id)">🔗</button>
            <NuxtLink :to="`/admin/entregas/save/${e.sessao_id}`" class="btn-icon" title="Editar">✏️</NuxtLink>
            <button class="btn-icon btn-danger" title="Excluir" @click="deleteEntrega(e)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
