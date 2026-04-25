<script lang="ts" setup>
definePageMeta({ layout: false });
useHead({ title: 'Seu Ensaio — Lillia Tavares' });

const { isAuthenticated, checkSession } = useClientAuth();
const router = useRouter();
const route = useRoute();
const sessaoId = Number(route.params.id);
const cfURI = useRuntimeConfig().public.cloudflareURI;

interface EntregaData {
  cliente_nome: string;
  nome_sessao: string;
  bg_image_id: string | null;
  mensagem: string | null;
  nome_arquivo: string | null;
  download_url: string;
}

const data = ref<EntregaData | null>(null);
const loading = ref(true);
const error = ref('');

function cfUrl(id: string) { return `${cfURI}${id}/public`; }

onMounted(async () => {
  await checkSession();
  if (!isAuthenticated.value) { await router.push('/area-cliente'); return; }
  try {
    data.value = await $fetch<EntregaData>(`/api/cliente/entregas/${sessaoId}`);
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Erro ao carregar entrega';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div v-if="loading" class="loader-screen">
      <span>Carregando...</span>
    </div>

    <div v-else-if="error" class="error-screen">
      <p>{{ error }}</p>
      <NuxtLink to="/area-cliente/meus-ensaios">← Voltar</NuxtLink>
    </div>

    <div
      v-else-if="data"
      class="entrega-page"
      :style="data.bg_image_id ? { backgroundImage: `url(${cfUrl(data.bg_image_id)})` } : {}"
    >
      <div class="entrega-overlay"></div>

      <div class="entrega-content">
        <div class="entrega-brand">Lillia Tavares</div>

        <div class="entrega-card">
          <p class="entrega-para">Para: <strong>{{ data.cliente_nome }}</strong></p>
          <p class="entrega-sessao">{{ data.nome_sessao }}</p>
          <p v-if="data.mensagem" class="entrega-msg">{{ data.mensagem }}</p>

          <a :href="data.download_url" target="_blank" rel="noopener" class="download-btn">
            📦 Baixar ensaio
            <span v-if="data.nome_arquivo" class="download-filename">{{ data.nome_arquivo }}</span>
          </a>

          <a
            href="https://wa.me/5511911159795?text=Ol%C3%A1%20Lillia!%20Amei%20meu%20ensaio!%20Quero%20conversar%20sobre%20mais%20fotos%20%F0%9F%92%9B"
            target="_blank"
            rel="noopener"
            class="whatsapp-btn"
          >
            💬 Quero mais fotos!
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loader-screen, .error-screen {
  min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 16px; font-family: 'Lato', sans-serif; color: #6b7280;
  a { color: #5e2012; text-decoration: none; }
}

.entrega-page {
  min-height: 100vh;
  background: #1a0f0b no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Lato', sans-serif;
  padding: 32px 16px;
  position: relative;
}

.entrega-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(10,5,3,0.72) 0%, rgba(10,5,3,0.55) 100%);
}

.entrega-content {
  position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 32px;
  width: 100%; max-width: 520px; text-align: center;
}

.entrega-brand {
  font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.7); letter-spacing: 0.1em;
  text-transform: uppercase;
}

.entrega-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 24px;
  padding: 40px 32px;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  width: 100%;
}

.entrega-para {
  font-size: 14px; color: rgba(255,255,255,0.6); strong { color: rgba(255,255,255,0.9); }
}

.entrega-sessao {
  font-size: 22px; font-weight: 700; color: #fff; line-height: 1.3;
}

.entrega-msg {
  font-size: 16px; color: rgba(255,255,255,0.8); line-height: 1.65;
  white-space: pre-wrap;
}

.download-btn {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  background: #fff; color: #1f2937;
  text-decoration: none; border-radius: 14px;
  padding: 16px 40px;
  font-size: 17px; font-weight: 700;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  width: 100%;

  &:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,0,0,0.4); }
}

.download-filename {
  font-size: 12px; font-weight: 400; color: #6b7280;
}

.whatsapp-btn {
  display: block; text-decoration: none;
  background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.85);
  border: 1px solid rgba(255,255,255,0.2); border-radius: 10px;
  padding: 12px 32px; font-size: 15px; font-weight: 500;
  width: 100%; text-align: center;
  transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.18); }
}
</style>
