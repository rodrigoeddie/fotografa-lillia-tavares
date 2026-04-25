/**
 * Composable para fazer fetch autenticado nas APIs admin.
 * Lê o token do sessionStorage e adiciona o header x-cms-token.
 */
export function useAdminFetch() {
  function adminFetch<T>(url: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
    const token = import.meta.client ? sessionStorage.getItem('cms_token') : null;
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
