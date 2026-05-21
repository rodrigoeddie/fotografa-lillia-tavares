const COOKIE_NAME = 'admin_token';
const COOKIE_MAX_AGE = 8 * 60 * 60; // 8 horas (igual ao JWT)

function tokenIsExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp && payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

export function useAdminAuth() {
  // useCookie é reativo no SSR e no cliente — persiste entre navegações
  const tokenCookie    = useCookie(COOKIE_NAME, { maxAge: COOKIE_MAX_AGE, sameSite: 'strict', path: '/' });
  const authenticated  = computed(() => !!tokenCookie.value && !tokenIsExpired(tokenCookie.value));

  const loginEmail    = ref('');
  const loginPassword = ref('');
  const loginError    = ref('');
  const loginLoading  = ref(false);

  async function doLogin() {
    loginLoading.value = true;
    loginError.value   = '';
    try {
      const res = await $fetch<{ success: boolean; token: string }>('/api/cms-login', {
        method: 'POST',
        body: { email: loginEmail.value, password: loginPassword.value },
      });
      if (res.success) {
        tokenCookie.value = res.token;
      }
    } catch {
      loginError.value = 'Email ou senha incorretos';
    } finally {
      loginLoading.value = false;
    }
  }

  function logout() {
    tokenCookie.value = null;
  }

  return {
    authenticated,
    cmsToken: tokenCookie,
    loginEmail,
    loginPassword,
    loginError,
    loginLoading,
    doLogin,
    logout,
  };
}
