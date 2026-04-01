const authenticated = ref(false);
const cmsToken = ref('');

export function useAdminAuth() {
  const loginPassword = ref('');
  const loginError = ref('');
  const loginLoading = ref(false);

  async function doLogin() {
    loginLoading.value = true;
    loginError.value = '';
    try {
      const res = await $fetch<{ success: boolean; token: string }>('/api/cms-login', {
        method: 'POST',
        body: { password: loginPassword.value },
      });
      if (res.success) {
        cmsToken.value = res.token;
        authenticated.value = true;
        sessionStorage.setItem('cms_token', res.token);
      }
    } catch {
      loginError.value = 'Senha incorreta';
    } finally {
      loginLoading.value = false;
    }
  }

  function restoreSession() {
    const stored = sessionStorage.getItem('cms_token');
    if (stored) {
      cmsToken.value = stored;
      authenticated.value = true;
    }
  }

  return {
    authenticated,
    cmsToken,
    loginPassword,
    loginError,
    loginLoading,
    doLogin,
    restoreSession,
  };
}
