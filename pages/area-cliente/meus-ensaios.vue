<script lang="ts" setup>
definePageMeta({ layout: 'cliente', middleware: 'cliente-auth' });
useHead({ title: 'Meus Ensaios — Lillia Tavares' });

const { checkSession, clienteData } = useClientAuth();

const cfImg = useCfImg();
const MAPS_URL = 'https://g.page/r/CcJKsXVkfFvXEBM/review';

interface Sessao {
  id: number;
  nome_sessao: string;
  produto_tipo: string;
  pacote_titulo: string | null;
  pacote_index: number;
  fotos_incluidas: number;
  status: string;
  criado_em: string;
  capa_foto_id: string | null;
  primeira_foto_id: string | null;
}

const sessoes = ref<Sessao[]>([]);
const loading = ref(true);
const NuxtLinkComponent = resolveComponent('NuxtLink');

const bgImageUrl = computed(() => {
  const id = clienteData.value?.bg_image;
  return id ? cfImg(id) : null;
});

const statusInfo: Record<string, {
  label: string;
  color: string;
  action?: string;
  route?: (id: number) => string;
  message?: string }> = {
  aguardando_fotos: {
    label: 'Fotos em preparação',
    color: '#d97706',
    message: `
      Maravilha, o ensaio foi realizado!<br>
      Agora a Lillia está preparando as fotos para você.<br>
      Em breve elas estarão disponíveis por aqui<br>
      para você selecionar as suas favoritas!`
  },
  aguardando_selecao: {
    label: 'Pronto para seleção!',
    color: '#2563eb',
    action: 'Selecionar fotos',
    route: (id) => `/area-cliente/selecao/${id}`
  },
  selecao_concluida: {
    label: 'Seleção enviada ✓',
    color: '#16a34a',
    message: `
      Sua seleção foi enviada para a Lillia.<br>
      Em breve ela irá preparar as fotos escolhidas<br>
      e avisar quando estiverem prontas,<br>
      você poderá baixar diretamente por aqui!`
  },
  entregue: {
    label: 'Ensaio entregue! <span class="material-symbols-outlined"> download_for_offline </span>',
    color: '#7c3aed',
    action: 'Baixar ensaio',
    route: (id) => `/area-cliente/entrega/${id}`
  },
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
  <div class="shoots-page">
    <div v-if="!bgImageUrl" class="shoots-header" :class="{ 'has-hero': !!bgImageUrl }">
      <div>
        <h1>Meus Ensaios</h1>
        <p class="shoots-sub">Acompanhe suas sessões fotográficas</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <span>Carregando...</span>
    </div>

    <div v-else-if="sessoes.length === 0" class="empty-state">
      <div class="empty-icon"><span class="material-symbols-outlined"> photo_camera </span></div>
      <p>Não há nenhum ensaio cadastrado.</p>
      <p class="text-muted">Em breve a Lillia irá preparar suas fotos!</p>
    </div>

    <div v-else class="sessoes-grid">
      <div v-if="bgImageUrl" class="shoots-hero" :style="{ backgroundImage: `url(${bgImageUrl})` }">
        <div class="shoots-hero-overlay">
          <h1 class="shoots-hero-title">Olá, {{ clienteData?.nome?.split(' ')[0] }}</h1>
          <p>Acompanhe suas sessões fotográficas:</p>
        </div>
      </div>

      <component
        :is="statusInfo[s.status]?.route ? NuxtLinkComponent : 'div'"
        v-for="s in sessoes"
        :key="s.id"
        class="shoot-card"
        :class="{ 'shoot-link': !!statusInfo[s.status]?.route }"
        :to="statusInfo[s.status]?.route ? statusInfo[s.status]!.route!(s.id) : undefined">
        <div class="shoot-thumb">
          <nuxt-img
            v-if="s.capa_foto_id ?? s.primeira_foto_id"
            provider="cloudflare"
            :src="cfImg(s.capa_foto_id ?? s.primeira_foto_id)"
            format="webp"
            width="400"
            placeholder
            loading="lazy"
            :alt="s.nome_sessao"
          />
          <div v-else class="shoot-thumb-placeholder"><span class="material-symbols-outlined"> photo_camera </span></div>
        </div>

        <div
          class="shoot-status"
          :style="{ background: statusInfo[s.status]?.color ?? '#6b7280' }"
          v-html="statusInfo[s.status]?.label ?? s.status">
        </div>

        <div class="wrap-info">
          <div class="shoot-product-info">
            <div class="shoot-product-name">{{ s.produto_tipo }}</div>
            <div class="shoot-package">
              <span>Pacote {{ s.pacote_titulo }}</span>
              <span>·</span>
              <span>{{ s.fotos_incluidas }} fotos incluídas</span>
            </div>
          </div>
  
          <div class="shoot-progress">
            <div
              class="progress-step"
              :class="{ done: ['aguardando_fotos', 'aguardando_selecao', 'selecao_concluida', 'entregue'].includes(s.status), current: s.status === 'aguardando_fotos' }">
              <span class="material-symbols-outlined"> add_a_photo </span>
              <span>Ensaio</span>
            </div>

            <div class="progress-line" :class="['aguardando_selecao', 'selecao_concluida', 'entregue'].includes(s.status) ? 'done' : ''"></div>
          
            <div class="progress-step" :class="{ done: ['aguardando_selecao', 'selecao_concluida', 'entregue'].includes(s.status), current: s.status === 'aguardando_selecao' }">
              <span class="material-symbols-outlined"> select </span>
              <span>Seleção</span>
            </div>
            
            <div class="progress-line" :class="['selecao_concluida', 'entregue'].includes(s.status) ? 'done' : ''"></div>
            
            <div class="progress-step" :class="{ done: ['selecao_concluida', 'entregue'].includes(s.status), current: s.status === 'selecao_concluida' }">
              <span class="material-symbols-outlined"> select_all </span>
              <span>Selecionado</span>
            </div>
            
            <div class="progress-line" :class="s.status === 'entregue' ? 'done' : ''"></div>

            <div class="progress-step" :class="{ done: s.status === 'entregue', current: s.status === 'entregue' }">
              <span class="material-symbols-outlined"> cloud_upload </span>
              <span>Entregue</span>
            </div>
          </div>

          <div v-if="statusInfo[s.status]?.message" class="shoot-message" v-html="statusInfo[s.status]?.message"></div>

          <div v-if="statusInfo[s.status]?.action" class="shoot-cta">
            {{ statusInfo[s.status]?.action }} →
          </div>
        </div>
      </component>

      <div class="shoot-card empty"></div>
    </div>

    <!-- Google Maps review CTA -->
    <div class="maps-cta">
      <a :href="MAPS_URL" target="_blank" rel="noopener noreferrer" class="maps-btn">
        <span class="material-symbols-outlined"> map_pin_review </span>
        Avalie nosso estúdio no Google Maps
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shoots-hero {
  width: 20%;
  aspect-ratio: 1;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  text-align: right;

  @media (max-width: 600px) {
    height: 180px;
    border-radius: 12px;
  }
  
  .shoots-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%);
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    justify-content: flex-end;
    padding: 24px;
  
    p {
      color: white;
      font-size: 18rem;
    }
  }
  
  .shoots-hero-title {
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 6px rgba(0,0,0,0.4);
    margin: 0;
  }
}

.shoots-header {
  padding-top: 25px;
  margin-bottom: 15px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 4px;
  }

  &.has-hero {
    margin-bottom: 24px;
  }
}

.shoots-sub {
  font-size: 15px;
  color: #6b7280;
}

.loading-state { text-align: center; padding: 48px; color: #9ca3af; }
.empty-state { text-align: center; padding: 64px 32px; .empty-icon { font-size: 48px; margin-bottom: 16px; } p { color: #374151; font-size: 16px; } .text-muted { color: #9ca3af; font-size: 14px; margin-top: 4px; } }

.sessoes-grid {
  justify-content: flex-end;
  padding-top: 15px;
  flex-wrap: wrap;
  display: flex;
  width: 100%;
  gap: 15px;
}

.shoot-card {
  border: 1px solid #f0ede8;
  width: calc(40% - 15px);
  text-decoration: none;
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
  color: inherit;
  display: flex;

  &--link {
    transition: box-shadow 0.15s, transform 0.15s;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 10px rgba(77, 15, 1, 0.12);
    }
  }

  &.empty {
    border: none;
    background: transparent;
    pointer-events: none;
  }
  
  .shoot-thumb {
    width: 185px;
    aspect-ratio: 1;
    overflow: hidden;
    flex-shrink: 0;
    height: 100%;
    background: #f3f0ec;
  
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .shoot-message {
    font-size: 14px;
    color: #4b5563;
  }

  .wrap-info {
    padding: 20px;
  }
  
  .shoot-thumb-placeholder {
    width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
    font-size: 40px; color: #d1c9bf;
  }

  .shoot-product-info {
    padding-top: 15px;
    color: #666;

    .shoot-product-name {
      padding-bottom: 10px;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .shoot-package {
      display: flex;
      font-size: 13px;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  .shoot-status {
    border-bottom-left-radius: 12px;
    position: absolute;
    padding: 5px 10px;
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: white;
    right: 0;
    top: 0;
  }

  .shoot-name {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    line-height: 1.3;
  }


  
  .shoot-progress {
    align-items: center;
    margin-bottom: 30px;
    margin-top: 30px;
    display: flex;
    gap: 0;
    
    .progress-step {
      text-transform: uppercase;
      flex-direction: column;
      align-items: center;
      white-space: nowrap;
      font-weight: 600;
      color: #d1d5db;
      font-size: 12px;
      display: flex;
      opacity: 0;
      
      &.done {
        color: #d1d5db;
        opacity: 1;
      }

      &.current {
        color: #5e2012;

        .material-symbols-outlined {
          background: #5e2012;
          color: #fff;
          border-radius: 50%;
          padding: 4px;
          font-size: 16px;
        }
      }
    }
    
    .progress-line {
      flex: 1;
      height: 2px;
      background: #e5e7eb;
      margin: 0 6px;
    
      &.done {
        background: #5e2012;
      }
    }
  }
  
  .shoot-cta {
    display: inline-block;
    background: #5e2012;
    color: #fff;
    text-decoration: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    transition: background 0.15s;
  
    &:hover {
      background: #4a1a0f;
    }
  }
}

.maps-cta {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #f0ede8;
  text-align: center;
}

.maps-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  color: #374151;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  svg {
    color: #ea4335;
    flex-shrink: 0;
  }

  &:hover {
    border-color: #ea4335;
    box-shadow: 0 2px 12px rgba(234,67,53,0.12);
    color: #ea4335;
  }
}
</style>
