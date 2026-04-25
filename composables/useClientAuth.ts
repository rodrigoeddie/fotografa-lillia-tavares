const clienteData = ref<{ id: number; nome: string; email: string } | null>(null);
const isAuthenticated = ref(false);

export function useClientAuth() {
  async function checkSession() {
    try {
      const res = await $fetch<{ cliente: { id: number; nome: string; email: string }; sessoes: any[] }>('/api/cliente/sessoes');
      clienteData.value = res.cliente;
      isAuthenticated.value = true;
      return res.sessoes as any[];
    } catch {
      clienteData.value = null;
      isAuthenticated.value = false;
      return null;
    }
  }

  async function login(email: string, senha: string) {
    const res = await $fetch<{ success: boolean; cliente: any }>('/api/cliente/auth/login', {
      method: 'POST',
      body: { email, senha },
    });
    clienteData.value = res.cliente;
    isAuthenticated.value = true;
    return res;
  }

  async function logout() {
    await $fetch('/api/cliente/auth/logout', { method: 'POST' });
    clienteData.value = null;
    isAuthenticated.value = false;
    await navigateTo('/area-cliente');
  }

  return { clienteData, isAuthenticated, login, logout, checkSession };
}
