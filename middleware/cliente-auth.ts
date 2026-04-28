export default defineNuxtRouteMiddleware(() => {
  // Server: cookie httpOnly é legível apenas no servidor
  if (import.meta.server) {
    const session = useCookie('cliente_session');
    if (!session.value) {
      return navigateTo('/area-cliente');
    }
    return;
  }

  // Client: usa estado reativo do composable (definido após login bem-sucedido)
  const { isAuthenticated } = useClientAuth();
  if (!isAuthenticated.value) {
    return navigateTo('/area-cliente');
  }
});
