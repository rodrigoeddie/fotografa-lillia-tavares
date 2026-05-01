export default defineNuxtRouteMiddleware(() => {
  const { authenticated } = useAdminAuth();

  if (!authenticated.value) {
    // Fica na página atual (o layout exibe o form de login)
    // Não faz redirect para não expor a rota /admin
    return;
  }
});
