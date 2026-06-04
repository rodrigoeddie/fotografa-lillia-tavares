<script setup lang="ts">
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'created', cliente: { id: number; nome: string; email: string }): void;
}>();

const noId = ref<number | undefined>(undefined);
const { saving, form, save } = useClienteForm(noId);

watch(() => props.open, (val) => {
  if (val) {
    form.nome = '';
    form.email = '';
    form.celular = '';
    form.senha = '';
    form.bg_image = '';
  }
});

async function handleSave() {
  await save((id) => {
    if (id !== undefined) {
      emit('created', { id, nome: form.nome, email: form.email });
    }
    emit('close');
  });
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-overlay" @mousedown.self="$emit('close')">
        <div class="modal-box">
          <div class="modal-header">
            <h3>Novo cliente</h3>
            <button class="modal-close-btn" type="button" @click="$emit('close')">✕</button>
          </div>
          <div class="modal-body">
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
                <label>Senha</label>
                <input v-model="form.senha" type="text" placeholder="Senha de acesso" autocomplete="new-password" />
              </div>
              <div class="form-field">
                <label>Celular <small>(opcional)</small></label>
                <input v-model="form.celular" type="tel" placeholder="95980-1065" maxlength="10" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" type="button" @click="$emit('close')">
              <span class="material-symbols-outlined">cancel</span>
              <span>Cancelar</span>
            </button>
            <button class="btn-primary" type="button" :disabled="saving" @click="handleSave">
              <span class="material-symbols-outlined">person_add</span>
              <span>{{ saving ? 'Criando...' : 'Criar cliente' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-box {
  background: #0d1117;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #1a1a1a;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }
}

.modal-close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  line-height: 1;
  &:hover { color: #fff; background: #1a1a1a; }
}

.modal-body {
  padding: 20px 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #1a1a1a;
}

/* transition */
.modal-enter-active, .modal-leave-active { transition: opacity 0.15s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
