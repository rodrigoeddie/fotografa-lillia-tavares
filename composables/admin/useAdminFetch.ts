/**
 * Composable para fazer fetch autenticado nas APIs admin.
 * Lê o token do cookie admin_token e adiciona o header x-cms-token.
 */
export function useAdminFetch() {
  const { cmsToken } = useAdminAuth();

  function adminFetch<T>(url: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
    const token = cmsToken.value;
    return $fetch<T>(url, {
      ...options,
      headers: {
        ...(options.headers as Record<string, string> ?? {}),
        ...(token ? { 'x-cms-token': token } : {}),
      },
    });
  }

  return { adminFetch };
}
