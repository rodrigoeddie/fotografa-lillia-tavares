<script setup>
import { useRouter } from 'vue-router';

const email    = ref('');
const password = ref('');
const router   = useRouter();

const login = async () => {
  const { data, error } = await useFetch('/api/auth', {
    method: 'POST',
    body: { email: email.value, password: password.value },
  });

  if (data.value?.success) {
    useCookie('auth_token').value = data.value.token; // Salva o token no cookie
    router.push('/cms'); // Redireciona para o CMS
  } else {
    alert('Invalid credentials');
  }
};

definePageMeta({
  layout: false,
});
</script>

<template>
  <div class="wrap-cms">
    <div class="inner">
      <h1 class="title">Login</h1>

      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="login" class="btn-primary">Login</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap-cms {
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100vh;

  .inner {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    input {
      font-size: 16px;
      display: block;
      padding: 15px;
      height: 40px;
      width: 100%;
    }

    .btn-primary {
      background: v.$dark-green;
      padding: 10px 20px;
      font-size: 18px;
    }
  }
}
</style>
