<script lang="ts" setup>
definePageMeta({ layout: 'cliente', middleware: 'cliente-auth' });
useHead({ title: 'Confirmação de Pagamento — Lillia Tavares' });

const route = useRoute();
const router = useRouter();

const sessaoId = route.query.sessao_id as string;

type StatusPag = 'verificando' | 'pago' | 'cancelado' | 'pendente' | 'erro';
const status = ref<StatusPag>('verificando');

onMounted(async () => {
  /* A SumUp não anexa o checkout_id no retorno; usamos o id guardado no checkout. */
  const checkoutId = (route.query.checkout_id as string) || sessionStorage.getItem('sumup_checkout_id') || '';
  if (!checkoutId) {
    status.value = 'erro';
    return;
  }
  sessionStorage.removeItem('sumup_checkout_id');
  try {
    const res = await $fetch<{ status: string; sessao_id: number }>(`/api/cliente/pagamento/retorno?checkout_id=${checkoutId}`);
    if (res.status === 'pago') {
      status.value = 'pago';
      setTimeout(() => router.push('/area-cliente/meus-ensaios'), 3500);
    } else if (res.status === 'cancelado') {
      status.value = 'cancelado';
    } else {
      status.value = 'pendente';
    }
  } catch {
    status.value = 'erro';
  }
});
</script>

<template>
  <div class="retorno-page">
    <!-- Verificando -->
    <div v-if="status === 'verificando'" class="retorno-card">
      <span class="material-symbols-outlined spin">autorenew</span>
      <h2>Confirmando pagamento...</h2>
      <p>Aguarde enquanto verificamos o status.</p>
    </div>

    <!-- Pago -->
    <div v-else-if="status === 'pago'" class="retorno-card success">
      <span class="material-symbols-outlined">check_circle</span>
      <h2>Pagamento confirmado!</h2>
      <p>Tudo certo! Você será redirecionada em instantes.</p>
      <NuxtLink to="/area-cliente/meus-ensaios" class="btn">Ver meus ensaios</NuxtLink>
    </div>

    <!-- Pendente -->
    <div v-else-if="status === 'pendente'" class="retorno-card warning">
      <span class="material-symbols-outlined">schedule</span>
      <h2>Pagamento em processamento</h2>
      <p>Seu pagamento está sendo processado. Assim que confirmado, atualizaremos seu ensaio.</p>
      <NuxtLink to="/area-cliente/meus-ensaios" class="btn">Ver meus ensaios</NuxtLink>
    </div>

    <!-- Cancelado -->
    <div v-else-if="status === 'cancelado'" class="retorno-card error">
      <span class="material-symbols-outlined">cancel</span>
      <h2>Pagamento não realizado</h2>
      <p>O pagamento foi cancelado ou recusado. Você pode tentar novamente ou combinar diretamente com a Lillia.</p>
      <NuxtLink v-if="sessaoId" :to="`/area-cliente/selecao/${sessaoId}`" class="btn">Voltar à seleção</NuxtLink>
      <NuxtLink to="/area-cliente/meus-ensaios" class="btn btn-sec">Ver meus ensaios</NuxtLink>
    </div>

    <!-- Erro -->
    <div v-else class="retorno-card error">
      <span class="material-symbols-outlined">error</span>
      <h2>Não foi possível verificar</h2>
      <p>Ocorreu um erro ao verificar o pagamento. Se realizou o pagamento, entre em contato com a Lillia.</p>
      <NuxtLink to="/area-cliente/meus-ensaios" class="btn">Ver meus ensaios</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.retorno-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 32px 16px;
}

.retorno-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 48px 40px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .material-symbols-outlined {
    font-size: 56px;
    color: #9ca3af;

    &.spin { animation: spin 1s linear infinite; }
  }

  h2 { font-size: 22px; font-weight: 700; color: #1f2937; margin: 0; }
  p { font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0; }

  &.success .material-symbols-outlined { color: #15803d; }
  &.warning .material-symbols-outlined { color: #92400e; }
  &.error   .material-symbols-outlined { color: #991b1b; }
}

.btn {
  display: inline-flex; align-items: center; justify-content: center;
  background: #5e2012; color: #fff; text-decoration: none; border-radius: 10px;
  padding: 12px 28px; font-size: 15px; font-weight: 600;
  transition: background 0.15s;
  &:hover { background: #4a1a0f; }
  &.btn-sec { background: transparent; color: #5e2012; border: 2px solid #5e2012; &:hover { background: #fdf8f5; } }
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
