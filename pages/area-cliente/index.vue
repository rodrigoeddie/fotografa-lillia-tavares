<script lang="ts" setup>
definePageMeta({ layout: 'cliente' });
useHead({ title: 'Área do Cliente — Lillia Tavares' });

const cfImg = useCfImg();

const { login } = useClientAuth();
const router = useRouter();

const form    = reactive({ email: '', senha: '' });
const error   = ref('');
const loading = ref(false);

async function handleLogin() {
  if (!form.email || !form.senha) {
    error.value = 'Preencha e-mail e senha';
    return;
  }
  loading.value = true;
  error.value = '';

  try {
    await login(form.email, form.senha);
    await router.push('/area-cliente/meus-ensaios');
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'E-mail ou senha incorretos';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <span class="login-brand-name">
          <nuxt-img
            provider="cloudflare"
            :src="cfImg('19bd6c18-a153-4e79-c6bd-4293145da400')"
            alt="Logotipo Lillia Tavares Fotografia"
            width="390"
            height="107"
            class="logo-black"
            format="webp"
            fetchpriority="high"
            preload
            placeholder />
        </span>
        <p class="login-brand-sub">Área exclusiva para clientes</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="field">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            autocomplete="email"
            autofocus
          />
        </div>
        <div class="field">
          <label for="senha">Senha</label>
          <input
            id="senha"
            v-model="form.senha"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
          />
        </div>

        <p v-if="error" class="login-error">{{ error }}</p>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="login-help">
        Precisa de ajuda? Entre em contato pelo
        <a href="https://wa.me/5511911159795" target="_blank" rel="noopener">WhatsApp</a>.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: calc(100vh - 60px);
  justify-content: center;
  align-items: center;
  display: flex;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
}

.login-brand {
  text-align: center;
  margin-bottom: 32px;
}

.login-brand-name {
  margin-bottom: 15px;
  margin-right: auto;
  margin-left: auto;
  display: block;
  width: 80%;

  img {
    height: auto;
  }
}

.login-brand-sub {
  font-size: 16px;
  color: #69554d;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }

  input {
    padding: 10px 14px;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.15s;

    &:focus-visible {
      outline: 2px solid #5e2012;
      outline-offset: 2px;
      border-color: #5e2012;
    }
  }
}

.login-error {
  font-size: 13px;
  color: #b91c1c;
  background: #fef2f2;
  padding: 8px 12px;
  border-radius: 6px;
}

.login-btn {
  background: #5e2012;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: #4a1a0f; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}

.login-help {
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
  margin-top: 24px;

  a { color: #5e2012; text-decoration: none; &:hover { text-decoration: underline; } }
}
</style>
