<script lang="ts" setup>
import type { LinktreeItemType } from '~/shared/schemas/linktree';

const cfImg = useCfImg();
const {
  loading, loadingPreset, saving,
  presets, selectedId, selectedPreset, isSelectedActive, dirty,
  profile, items, itemClicks,
  posts, works, deps,
  load, selectPreset,
  createPreset, duplicatePreset, renamePreset, deletePreset, activatePreset,
  addItem, removeItem, save, uploadImage,
  dragIdx, dragOverIdx, onDragStart, onDragOver, onDrop,
  TIPO_LABELS, DESTINO_OPTIONS,
} = useLinktreeForm();

const TEMA_LABELS: Record<string, string> = {
  claro: 'Claro', escuro: 'Escuro', marrom: 'Marrom', azul: 'Azul',
};

const novoTipo = ref<LinktreeItemType>('atalho');
const tipoOptions = Object.entries(TIPO_LABELS) as [LinktreeItemType, string][];

const avatarInput = ref<HTMLInputElement | null>(null);
const bannerInputs = ref<Record<number, HTMLInputElement | null>>({});

/* Prévia: iframe da página real /links (reflete o último estado salvo). */
const previewTick = ref(0);
const previewUrl = computed(() => (previewTick.value ? `/links?_=${previewTick.value}` : '/links'));
function reloadPreview() { previewTick.value++; }

/* Salva e, em seguida, recarrega a prévia com o estado novo. */
async function saveAndPreview() {
  await save();
  reloadPreview();
}

async function onAvatarPick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const id = await uploadImage(file);
  if (id) profile.avatarCfId = id;
}

async function onBannerPick(e: Event, idx: number) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const id = await uploadImage(file);
  if (id && items.value[idx]) items.value[idx]!.config.imageCfId = id;
}

defineExpose({ load });
</script>

<template>
  <div class="lt-editor">
    <div class="lt-layout">
      <div class="lt-main">
    <div class="lt-header">
      <h2>Linktree</h2>
      <div class="lt-header-actions">
        <NuxtLink to="/links" target="_blank" class="lt-preview-link">
          <span class="material-symbols-outlined">open_in_new</span> Ver /links
        </NuxtLink>
        <button class="lt-btn lt-btn-save" :disabled="saving || selectedId === null" @click="saveAndPreview">
          {{ saving ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>

    <p v-if="loading" class="lt-loading">Carregando...</p>

    <template v-else>
      <!-- Presets (temporadas / temas) -->
      <section class="lt-presets">
        <div class="lt-presets-head">
          <div>
            <h3>Presets</h3>
            <p class="lt-presets-hint">Coleções de links por temporada. Só uma fica no ar por vez.</p>
          </div>
          <button class="lt-btn lt-btn-sm" @click="createPreset">+ Novo preset</button>
        </div>

        <div class="lt-preset-tabs">
          <button
            v-for="p in presets"
            :key="p.id"
            class="lt-preset-tab"
            :class="{ 'is-selected': p.id === selectedId, 'is-live': p.ativo }"
            @click="selectPreset(p.id)"
          >
            <span class="lt-preset-name">{{ p.titulo }}</span>
            <span v-if="p.ativo" class="lt-live-badge">no ar</span>
            <span class="lt-preset-meta">{{ p.blocos }} bloco{{ p.blocos === 1 ? '' : 's' }} · {{ TEMA_LABELS[p.tema] || p.tema }}</span>
          </button>
        </div>

        <div v-if="selectedPreset" class="lt-preset-actions">
          <button
            v-if="!isSelectedActive"
            class="lt-btn lt-btn-live"
            @click="activatePreset(selectedPreset.id)"
          >
            <span class="material-symbols-outlined">rocket_launch</span> Publicar este preset
          </button>
          <span v-else class="lt-live-note">
            <span class="material-symbols-outlined">public</span> Este preset está no ar
          </span>
          <div class="lt-preset-tools">
            <button class="lt-btn lt-btn-sm lt-btn-ghost" @click="renamePreset(selectedPreset.id)">Renomear</button>
            <button class="lt-btn lt-btn-sm lt-btn-ghost" @click="duplicatePreset(selectedPreset.id)">Duplicar</button>
            <button
              class="lt-btn lt-btn-sm lt-btn-ghost lt-btn-danger"
              :disabled="presets.length <= 1"
              :title="presets.length <= 1 ? 'É o único preset' : 'Excluir preset'"
              @click="deletePreset(selectedPreset.id)"
            >Excluir</button>
          </div>
        </div>
      </section>

      <div v-if="selectedPreset" class="lt-editing-banner" :class="{ 'is-dirty': dirty }">
        Editando <strong>{{ selectedPreset.titulo }}</strong>
        <span v-if="!isSelectedActive" class="lt-editing-draft">· rascunho (não está no ar)</span>
        <span v-if="dirty" class="lt-editing-dirty">· alterações não salvas</span>
      </div>

      <p v-if="loadingPreset" class="lt-loading">Abrindo preset...</p>

      <template v-else-if="selectedPreset">
      <!-- Perfil -->
      <section class="lt-card">
        <h3>Cabeçalho</h3>
        <div class="lt-profile">
          <div class="lt-avatar">
            <img v-if="profile.avatarCfId" :src="cfImg(profile.avatarCfId, 'thumbnail')" alt="Avatar" />
            <div v-else class="lt-avatar-empty"><span class="material-symbols-outlined">person</span></div>
            <button class="lt-btn lt-btn-sm" @click="avatarInput?.click()">
              {{ profile.avatarCfId ? 'Trocar' : 'Enviar foto' }}
            </button>
            <button v-if="profile.avatarCfId" class="lt-btn lt-btn-sm lt-btn-ghost" @click="profile.avatarCfId = ''">Remover</button>
            <input ref="avatarInput" type="file" accept="image/*" hidden @change="onAvatarPick" />
          </div>
          <div class="lt-profile-fields">
            <label>Nome
              <input v-model="profile.nome" type="text" placeholder="Fotógrafa Lillia Tavares" />
            </label>
            <label>Frase de destaque
              <input v-model="profile.headline" type="text" placeholder="Retratos femininos que celebram a sua singularidade" />
            </label>
            <label>Tema
              <select v-model="profile.tema">
                <option value="claro">Claro (verde/bege)</option>
                <option value="escuro">Escuro (verde)</option>
                <option value="marrom">Marrom (quente)</option>
                <option value="azul">Azul (corporativo)</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <!-- Adicionar bloco -->
      <div class="lt-add">
        <select v-model="novoTipo">
          <option v-for="[t, label] in tipoOptions" :key="t" :value="t">{{ label }}</option>
        </select>
        <button class="lt-btn" @click="addItem(novoTipo)">+ Adicionar bloco</button>
      </div>

      <!-- Lista de blocos -->
      <div class="lt-list" @dragover.prevent @drop.prevent="onDrop">
        <p v-if="!items.length" class="lt-empty">Nenhum bloco ainda. Adicione o primeiro acima.</p>

        <div
          v-for="(item, idx) in items"
          :key="idx"
          class="lt-item"
          :class="{ 'is-dragover': dragOverIdx === idx, 'is-inactive': !item.ativo }"
          draggable="true"
          @dragstart="onDragStart(idx)"
          @dragover.prevent="onDragOver(idx)"
        >
          <div class="lt-item-bar">
            <span class="lt-drag" title="Arraste para reordenar">⠿</span>
            <span class="lt-ordem">{{ idx + 1 }}</span>
            <span class="lt-tipo">{{ TIPO_LABELS[item.tipo] }}</span>
            <span class="lt-clicks" :title="`${itemClicks(item)} cliques`">
              <span class="material-symbols-outlined">ads_click</span> {{ itemClicks(item) }}
            </span>
            <label class="lt-switch" title="Ativo">
              <input type="checkbox" v-model="item.ativo" />
              <span class="lt-slider" />
            </label>
            <button class="lt-del" title="Remover" @click="removeItem(idx)">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>

          <div class="lt-item-body">
            <!-- atalho -->
            <template v-if="item.tipo === 'atalho'">
              <label>Destino
                <select v-model="item.config.destino">
                  <option v-for="o in DESTINO_OPTIONS" :key="o.key" :value="o.key">{{ o.label }}</option>
                </select>
              </label>
              <label>Texto (opcional)
                <input v-model="item.config.label" type="text" placeholder="usar texto padrão do destino" />
              </label>
              <label>Descrição (opcional)
                <input v-model="item.config.descricao" type="text" />
              </label>
            </template>

            <!-- post -->
            <template v-else-if="item.tipo === 'post'">
              <label>Post
                <select v-model.number="item.config.postId">
                  <option v-for="p in posts" :key="p.id" :value="p.id">{{ p.titulo }} ({{ p.categoria }})</option>
                </select>
              </label>
              <label>Texto (opcional)
                <input v-model="item.config.label" type="text" placeholder="usar título do post" />
              </label>
            </template>

            <!-- portfolio -->
            <template v-else-if="item.tipo === 'portfolio'">
              <label>Ensaio
                <select v-model.number="item.config.workId">
                  <option v-for="w in works" :key="w.id" :value="w.id">{{ w.titulo || w.slug }}</option>
                </select>
              </label>
              <label>Texto (opcional)
                <input v-model="item.config.label" type="text" placeholder="usar título do ensaio" />
              </label>
            </template>

            <!-- depoimento -->
            <template v-else-if="item.tipo === 'depoimento'">
              <label>Depoimento
                <select v-model.number="item.config.depoimentoId">
                  <option v-for="d in deps" :key="d.id" :value="d.id">{{ d.nome }}</option>
                </select>
              </label>
            </template>

            <!-- banner -->
            <template v-else-if="item.tipo === 'banner'">
              <div class="lt-banner">
                <img v-if="item.config.imageCfId" :src="cfImg(item.config.imageCfId, 'public')" alt="Banner" />
                <div v-else class="lt-banner-empty"><span class="material-symbols-outlined">image</span></div>
                <button class="lt-btn lt-btn-sm" @click="bannerInputs[idx]?.click()">
                  {{ item.config.imageCfId ? 'Trocar imagem' : 'Enviar imagem' }}
                </button>
                <input :ref="(el) => (bannerInputs[idx] = el as HTMLInputElement)" type="file" accept="image/*" hidden @change="(e) => onBannerPick(e, idx)" />
              </div>
              <label>Texto (opcional)
                <input v-model="item.config.label" type="text" />
              </label>
              <label>Link (opcional)
                <input v-model="item.config.url" type="text" placeholder="/rota ou https://..." />
              </label>
            </template>

            <!-- custom -->
            <template v-else-if="item.tipo === 'custom'">
              <label>Título
                <input v-model="item.config.titulo" type="text" />
              </label>
              <label>Conteúdo
                <AdminRichTextBasic v-model="item.config.html" />
              </label>
            </template>
          </div>
        </div>
      </div>
      </template>
    </template>
      </div>

      <aside class="lt-preview">
        <div class="lt-preview-head">
          <span>Prévia <em>/links</em></span>
          <button class="lt-preview-refresh" title="Atualizar prévia" @click="reloadPreview">
            <span class="material-symbols-outlined">refresh</span>
          </button>
        </div>
        <div class="lt-phone">
          <iframe :src="previewUrl" title="Prévia da página /links" loading="lazy" />
        </div>
        <p class="lt-preview-note">Mostra o último estado salvo. Salve para atualizar.</p>
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
.lt-editor { color: t.$text; }

.lt-layout {
  display: flex;
  align-items: flex-start;
  gap: 28px;
}
.lt-main { flex: 1; min-width: 0; max-width: 760px; }

/* Prévia (aside sticky) */
.lt-preview {
  position: sticky;
  top: 20px;
  flex-shrink: 0;
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.lt-preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: t.$text-2;
  em { color: t.$text-3; font-style: normal; }
}
.lt-preview-refresh {
  background: none;
  border: 1px solid t.$border-strong;
  border-radius: 6px;
  color: t.$text-2;
  cursor: pointer;
  padding: 3px;
  display: flex;
  .material-symbols-outlined { font-size: 18px; }
  &:hover { color: t.$text; border-color: t.$accent-line; }
}
.lt-phone {
  width: 100%;
  aspect-ratio: 390 / 780;
  background: t.$bg;
  border: 8px solid #1a1a1a;
  border-radius: 32px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }
}
.lt-preview-note { font-size: 11px; color: t.$text-3; text-align: center; }

@include m.max(lg) {
  .lt-preview { display: none; }
}

.lt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  h2 { font-size: 22px; }
}
.lt-header-actions { display: flex; align-items: center; gap: 12px; }

/* Presets */
.lt-presets {
  background: t.$surface;
  border: 1px solid t.$border;
  border-radius: 10px;
  padding: 16px 18px;
  margin-bottom: 16px;
}
.lt-presets-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  h3 { font-size: 14px; color: t.$text; }
}
.lt-presets-hint { font-size: 12px; color: t.$text-3; margin-top: 2px; }

.lt-preset-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.lt-preset-tab {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  min-width: 140px;
  padding: 9px 12px;
  background: t.$bg;
  border: 1px solid t.$border-strong;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
  &:hover { border-color: t.$accent-line; }
  &.is-selected { border-color: t.$accent; background: t.$surface-2; }
  &.is-live { box-shadow: inset 3px 0 0 t.$success, 0 0 0 1px transparent; }
}
.lt-preset-name { font-size: 13px; font-weight: 600; color: t.$text; }
.lt-preset-meta { font-size: 11px; color: t.$text-3; }
.lt-live-badge {
  align-self: flex-start;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: t.$success;
  background: color-mix(in srgb, t.$success 16%, transparent);
  border-radius: 999px;
  padding: 1px 7px;
}

.lt-preset-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid t.$border;
}
.lt-preset-tools { display: flex; gap: 8px; }
.lt-btn-live {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: t.$success;
  color: #06210f;
  .material-symbols-outlined { font-size: 18px; }
  &:hover:not(:disabled) { filter: brightness(1.08); background: t.$success; }
}
.lt-live-note {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: t.$success;
  .material-symbols-outlined { font-size: 18px; }
}
.lt-btn-danger {
  &:hover:not(:disabled) { color: t.$danger; border-color: t.$danger; }
}

.lt-editing-banner {
  font-size: 13px;
  color: t.$text-2;
  margin-bottom: 14px;
  padding: 8px 12px;
  background: t.$surface-2;
  border-radius: 8px;
  strong { color: t.$text; }
  &.is-dirty { box-shadow: inset 3px 0 0 t.$accent; }
}
.lt-editing-draft { color: t.$text-3; }
.lt-editing-dirty { color: t.$accent; }

.lt-preview-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: t.$accent;
  text-decoration: none;
  font-size: 13px;
  .material-symbols-outlined { font-size: 16px; }
  &:hover { color: t.$accent-hi; }
}

.lt-loading, .lt-empty { color: t.$text-3; padding: 16px 0; }
.lt-empty { text-align: center; border: 1px dashed t.$border-strong; border-radius: 8px; }

.lt-card {
  background: t.$surface;
  border: 1px solid t.$border;
  border-radius: 10px;
  padding: 18px;
  margin-bottom: 18px;
  h3 { font-size: 14px; color: t.$text; margin-bottom: 14px; }
}

.lt-profile { display: flex; gap: 20px; }
.lt-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  img { width: 84px; height: 84px; border-radius: 50%; object-fit: cover; border: 1px solid t.$border-strong; }
}
.lt-avatar-empty {
  width: 84px; height: 84px; border-radius: 50%;
  background: t.$surface-2; border: 1px solid t.$border-strong;
  display: flex; align-items: center; justify-content: center;
  .material-symbols-outlined { font-size: 40px; color: t.$text-3; }
}
.lt-profile-fields { flex: 1; display: flex; flex-direction: column; gap: 12px; }

.lt-add {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  select { flex: 1; max-width: 280px; }
}

label {
  display: block;
  font-size: 12px;
  color: t.$text-2;
  span { color: t.$text-2; }
}

input[type='text'], select, textarea {
  width: 100%;
  margin-top: 4px;
  padding: 8px 10px;
  background: t.$bg;
  border: 1px solid t.$border-strong;
  border-radius: 6px;
  color: t.$text;
  font-size: 14px;
  font-family: inherit;
  &:focus { outline: none; border-color: t.$accent-line; }
}

.lt-list { display: flex; flex-direction: column; gap: 10px; }

.lt-item {
  background: t.$surface;
  border: 1px solid t.$border;
  border-radius: 10px;
  overflow: hidden;
  &.is-dragover { border-color: t.$accent; }
  &.is-inactive { opacity: 0.55; }
}

.lt-item-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: t.$surface;
  border-bottom: 1px solid t.$border;
}
.lt-drag { cursor: grab; color: t.$text-3; font-size: 16px; user-select: none; }
.lt-ordem {
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  background: t.$surface-3; border-radius: 5px; font-size: 12px; color: t.$text-2;
}
.lt-tipo { flex: 1; font-size: 13px; color: t.$text; font-weight: 500; }

.lt-clicks {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: t.$text-3;
  background: t.$surface-2;
  padding: 2px 8px;
  border-radius: 999px;
  .material-symbols-outlined { font-size: 14px; }
}

.lt-del {
  background: none; border: none; color: t.$text-3; cursor: pointer; display: flex;
  .material-symbols-outlined { font-size: 20px; }
  &:hover { color: t.$danger; }
}

.lt-item-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lt-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  img { width: 120px; height: 64px; object-fit: cover; border-radius: 6px; border: 1px solid t.$border-strong; }
}
.lt-banner-empty {
  width: 120px; height: 64px; border-radius: 6px; background: t.$surface-2; border: 1px solid t.$border-strong;
  display: flex; align-items: center; justify-content: center;
  .material-symbols-outlined { color: t.$text-3; }
}

.lt-btn {
  background: t.$accent;
  border: none;
  color: t.$accent-ink;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover:not(:disabled) { background: t.$accent-hi; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}
.lt-btn-save { min-width: 96px; }
.lt-btn-sm { padding: 5px 10px; font-size: 12px; font-weight: 500; }
.lt-btn-ghost { background: transparent; border: 1px solid t.$border-strong; color: t.$text-2; &:hover { background: t.$surface-2; color: t.$text; } }

/* Switch ativo */
.lt-switch { position: relative; display: inline-block; width: 38px; height: 20px; }
.lt-switch input { opacity: 0; width: 0; height: 0; }
.lt-slider {
  position: absolute; inset: 0; cursor: pointer;
  background: t.$border-strong; border-radius: 20px; transition: 0.2s;
  &::before {
    content: ''; position: absolute; height: 14px; width: 14px; left: 3px; bottom: 3px;
    background: #fff; border-radius: 50%; transition: 0.2s;
  }
}
.lt-switch input:checked + .lt-slider { background: t.$accent; }
.lt-switch input:checked + .lt-slider::before { transform: translateX(18px); }
</style>
