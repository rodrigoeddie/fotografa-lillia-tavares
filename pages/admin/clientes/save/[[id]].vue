<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const { isEdit, loading, saving, form, init, save } = useClienteForm(idParam);

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/clientes" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar cliente' : 'Novo cliente' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else class="form-card">
      <div class="form-grid">
        <div class="form-field">
          <label>Nome</label>
          <input v-model="form.nome" type="text" placeholder="Nome completo" />
        </div>
        <div class="form-field">
          <label>E-mail</label>
          <input v-model="form.email" type="email" placeholder="email@exemplo.com" />
        </div>
        <div class="form-field">
          <label>{{ isEdit ? 'Nova senha' : 'Senha' }} <small v-if="isEdit">(deixe em branco para manter)</small></label>
          <input v-model="form.senha" type="password" :placeholder="isEdit ? 'Nova senha' : 'Senha de acesso'" autocomplete="new-password" />
        </div>
      </div>
      <div class="form-actions">
        <NuxtLink to="/admin/clientes" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/clientes'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar alterações' : '💾 Criar cliente') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
