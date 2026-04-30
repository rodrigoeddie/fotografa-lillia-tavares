export default defineNuxtRouteMiddleware(async () => {
  // Server: cookie httpOnly é legível apenas no servidor
  if (import.meta.server) {
    const session = useCookie('cliente_session');
    if (!session.value) {
      return navigateTo('/area-cliente');
    }
    return;
  }

  // Client: se ainda não autenticado (ex: após refresh), verifica sessão no servidor
  const { isAuthenticated, checkSession } = useClientAuth();
  if (!isAuthenticated.value) {
    const result = await checkSession();
    if (result === null) {
      return navigateTo('/area-cliente');
    }
  }
});
