export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('auth_token');

    // if (!token.value || token.value !== 'your-auth-token') {
    //   return navigateTo('/login');
    // }
});