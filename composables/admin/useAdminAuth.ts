const COOKIE_NAME = 'admin_token';
const COOKIE_MAX_AGE = 8 * 60 * 60;

export type AdminRole = 'super_admin' | 'editor' | 'sessions';

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  editor:      'Editor',
  sessions:    'Atendimento',
};

const ROLE_SECTIONS: Record<AdminRole, string[] | ['*']> = {
  super_admin: ['*'],
  editor:      ['hero-banners', 'portfolio', 'investimento', 'depoimentos', 'faq', 'page-faq', 'blog', 'cenarios', 'landing-pages', 'menu', 'seo', 'cache'],
  sessions:    ['clientes', 'sessoes', 'entregas'],
};

function parseToken(token: string): { username: string; adminRole: AdminRole } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.sub) return null;
    return { username: payload.sub, adminRole: (payload.adminRole as AdminRole) ?? 'super_admin' };
  } catch {
    return null;
  }
}

function tokenIsExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp && payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

export function useAdminAuth() {
  const tokenCookie   = useCookie(COOKIE_NAME, { maxAge: COOKIE_MAX_AGE, sameSite: 'strict', path: '/' });
  const authenticated = computed(() => !!tokenCookie.value && !tokenIsExpired(tokenCookie.value));

  const userRole = computed<AdminRole>(() => {
    if (!tokenCookie.value) return 'editor';
    return parseToken(tokenCookie.value)?.adminRole ?? 'super_admin';
  });

  const isSuperAdmin = computed(() => userRole.value === 'super_admin');

  function canAccess(section: string): boolean {
    const sections = ROLE_SECTIONS[userRole.value];
    if (!sections) return false;
    if (sections[0] === '*') return true;
    return (sections as string[]).includes(section);
  }

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
    userRole,
    isSuperAdmin,
    canAccess,
    loginEmail,
    loginPassword,
    loginError,
    loginLoading,
    doLogin,
    logout,
  };
}
