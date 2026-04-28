<script lang="ts" setup>
definePageMeta({ layout: 'cliente', middleware: 'cliente-auth' });
useHead({ title: 'Meus Ensaios — Lillia Tavares' });

const { checkSession } = useClientAuth();

interface Sessao {
  id: number;
  nome_sessao: string;
  produto_tipo: string;
  pacote_index: number;
  fotos_incluidas: number;
  status: string;
  criado_em: string;
}

const sessoes = ref<Sessao[]>([]);
const loading = ref(true);
const NuxtLinkComponent = resolveComponent('NuxtLink');

const statusInfo: Record<string, { label: string; color: string; action?: string; route?: (id: number) => string }> = {
  aguardando_fotos: { label: 'Fotos em preparação', color: '#d97706' },
  aguardando_selecao: { label: 'Pronto para seleção!', color: '#2563eb', action: 'Selecionar fotos', route: (id) => `/area-cliente/selecao/${id}` },
  selecao_concluida: { label: 'Seleção enviada ✓', color: '#16a34a' },
  entregue: { label: 'Ensaio entregue! 📦', color: '#7c3aed', action: 'Baixar ensaio', route: (id) => `/area-cliente/entrega/${id}` },
};

onMounted(async () => {
  const sessoesList = await checkSession();

  if (sessoesList === null) {
    loading.value = false;
    return;
  }

  sessoes.value = sessoesList;
  loading.value = false;
});
</script>

<template>
  <div class="ensaios-page">
    <div class="ensaios-header">
      <h1>Meus Ensaios</h1>
      <p class="ensaios-sub">Acompanhe suas sessões fotográficas</p>
    </div>

    <div v-if="loading" class="loading-state">
      <span>Carregando...</span>
    </div>

    <div v-else-if="sessoes.length === 0" class="empty-state">
      <div class="empty-icon">📷</div>
      <p>Não há nenhum ensaio cadastrado.</p>
      <p class="text-muted">Em breve a Lillia irá preparar suas fotos!</p>
    </div>

    <div v-else class="sessoes-grid">
      <component
        :is="statusInfo[s.status]?.route ? NuxtLinkComponent : 'div'"
        v-for="s in sessoes"
        :key="s.id"
        class="sessao-card"
        :class="{ 'sessao-card--link': !!statusInfo[s.status]?.route }"
        :to="statusInfo[s.status]?.route ? statusInfo[s.status].route(s.id) : undefined"
      >
        <div class="sessao-card-header">
          <div class="sessao-tipo">{{ s.produto_tipo }}</div>
          <div
            class="sessao-status"
            :style="{ color: statusInfo[s.status]?.color ?? '#6b7280' }"
          >
            {{ statusInfo[s.status]?.label ?? s.status }}
          </div>
        </div>

        <h2 class="sessao-nome">{{ s.nome_sessao }}</h2>

        <div class="sessao-meta">
          <span>Pacote {{ s.pacote_index + 1 }}</span>
          <span>·</span>
          <span>{{ s.fotos_incluidas }} fotos incluídas</span>
          <span>·</span>
          <span>{{ new Date(s.criado_em).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) }}</span>
        </div>

        <div class="sessao-progress">
          <div
            class="progress-step"
            :class="['aguardando_fotos', 'aguardando_selecao', 'selecao_concluida', 'entregue'].indexOf(s.status) >= 0 ? 'done' : ''"
          >Ensaio</div>
          <div class="progress-line" :class="['aguardando_selecao', 'selecao_concluida', 'entregue'].includes(s.status) ? 'done' : ''"></div>
          <div class="progress-step" :class="['aguardando_selecao', 'selecao_concluida', 'entregue'].includes(s.status) ? 'done' : ''">Seleção</div>
          <div class="progress-line" :class="['selecao_concluida', 'entregue'].includes(s.status) ? 'done' : ''"></div>
          <div class="progress-step" :class="['selecao_concluida', 'entregue'].includes(s.status) ? 'done' : ''">Selecionado</div>
          <div class="progress-line" :class="s.status === 'entregue' ? 'done' : ''"></div>
          <div class="progress-step" :class="s.status === 'entregue' ? 'done' : ''">Entregue</div>
        </div>

        <div v-if="statusInfo[s.status]?.action" class="sessao-cta">
          {{ statusInfo[s.status].action }} →
        </div>
      </component>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ensaios-page {}
.ensaios-header { margin-bottom: 32px; h1 { font-size: 28px; font-weight: 700; color: #1f2937; margin-bottom: 4px; } }
.ensaios-sub { font-size: 15px; color: #6b7280; }

.loading-state { text-align: center; padding: 48px; color: #9ca3af; }
.empty-state { text-align: center; padding: 64px 32px; .empty-icon { font-size: 48px; margin-bottom: 16px; } p { color: #374151; font-size: 16px; } .text-muted { color: #9ca3af; font-size: 14px; margin-top: 4px; } }

.sessoes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

.sessao-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #f0ede8;
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-decoration: none;
  color: inherit;

  &--link {
    cursor: pointer;
    transition: box-shadow 0.15s, transform 0.15s;
    &:hover {
      box-shadow: 0 4px 20px rgba(94,32,18,0.12);
      transform: translateY(-2px);
    }
  }
}

.sessao-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
.sessao-tipo { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; font-weight: 600; }
.sessao-status { font-size: 13px; font-weight: 700; }
.sessao-nome { font-size: 18px; font-weight: 700; color: #1f2937; line-height: 1.3; }
.sessao-meta { display: flex; gap: 8px; font-size: 13px; color: #9ca3af; flex-wrap: wrap; }

.sessao-progress {
  display: flex; align-items: center; gap: 0; margin-top: 4px;
}
.progress-step {
  font-size: 11px; color: #d1d5db; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
  white-space: nowrap;
  &.done { color: #5e2012; }
}
.progress-line {
  flex: 1; height: 2px; background: #e5e7eb; margin: 0 6px;
  &.done { background: #5e2012; }
}

.sessao-cta {
  display: inline-block;
  background: #5e2012;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-top: 4px;
  transition: background 0.15s;
  &:hover { background: #4a1a0f; }
}
</style>
