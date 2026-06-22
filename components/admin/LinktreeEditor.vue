<script lang="ts" setup>
import type { LinktreeItemType } from '~/shared/schemas/linktree';

const cfImg = useCfImg();
const {
  loading, saving, profile, items, itemClicks,
  posts, works, deps,
  load, addItem, removeItem, save, uploadImage,
  dragIdx, dragOverIdx, onDragStart, onDragOver, onDrop,
  TIPO_LABELS, DESTINO_OPTIONS,
} = useLinktreeForm();

const novoTipo = ref<LinktreeItemType>('atalho');
const tipoOptions = Object.entries(TIPO_LABELS) as [LinktreeItemType, string][];

const avatarInput = ref<HTMLInputElement | null>(null);
const bannerInputs = ref<Record<number, HTMLInputElement | null>>({});

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
    <div class="lt-header">
      <h2>Linktree</h2>
      <div class="lt-header-actions">
        <NuxtLink to="/links" target="_blank" class="lt-preview-link">
          <span class="material-symbols-outlined">open_in_new</span> Ver /links
        </NuxtLink>
        <button class="lt-btn lt-btn-save" :disabled="saving" @click="save">
          {{ saving ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>

    <p v-if="loading" class="lt-loading">Carregando...</p>

    <template v-else>
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
  </div>
</template>

<style lang="scss" scoped>
.lt-editor { color: #eee; max-width: 760px; }

.lt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  h2 { font-size: 22px; }
}
.lt-header-actions { display: flex; align-items: center; gap: 12px; }

.lt-preview-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #93c5fd;
  text-decoration: none;
  font-size: 13px;
  .material-symbols-outlined { font-size: 16px; }
  &:hover { color: #bfdbfe; }
}

.lt-loading, .lt-empty { color: #888; padding: 16px 0; }
.lt-empty { text-align: center; border: 1px dashed #333; border-radius: 8px; }

.lt-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 18px;
  margin-bottom: 18px;
  h3 { font-size: 14px; color: #ccc; margin-bottom: 14px; }
}

.lt-profile { display: flex; gap: 20px; }
.lt-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  img { width: 84px; height: 84px; border-radius: 50%; object-fit: cover; border: 1px solid #333; }
}
.lt-avatar-empty {
  width: 84px; height: 84px; border-radius: 50%;
  background: #222; border: 1px solid #333;
  display: flex; align-items: center; justify-content: center;
  .material-symbols-outlined { font-size: 40px; color: #555; }
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
  color: #999;
  span { color: #999; }
}

input[type='text'], select, textarea {
  width: 100%;
  margin-top: 4px;
  padding: 8px 10px;
  background: #111;
  border: 1px solid #333;
  border-radius: 6px;
  color: #eee;
  font-size: 14px;
  font-family: inherit;
  &:focus { outline: none; border-color: #2563eb; }
}

.lt-list { display: flex; flex-direction: column; gap: 10px; }

.lt-item {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  overflow: hidden;
  &.is-dragover { border-color: #2563eb; }
  &.is-inactive { opacity: 0.55; }
}

.lt-item-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #161616;
  border-bottom: 1px solid #222;
}
.lt-drag { cursor: grab; color: #666; font-size: 16px; user-select: none; }
.lt-ordem {
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  background: #252525; border-radius: 5px; font-size: 12px; color: #aaa;
}
.lt-tipo { flex: 1; font-size: 13px; color: #ddd; font-weight: 500; }

.lt-clicks {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: #888;
  background: #222;
  padding: 2px 8px;
  border-radius: 999px;
  .material-symbols-outlined { font-size: 14px; }
}

.lt-del {
  background: none; border: none; color: #777; cursor: pointer; display: flex;
  .material-symbols-outlined { font-size: 20px; }
  &:hover { color: #ef4444; }
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
  img { width: 120px; height: 64px; object-fit: cover; border-radius: 6px; border: 1px solid #333; }
}
.lt-banner-empty {
  width: 120px; height: 64px; border-radius: 6px; background: #222; border: 1px solid #333;
  display: flex; align-items: center; justify-content: center;
  .material-symbols-outlined { color: #555; }
}

.lt-btn {
  background: #2563eb;
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover:not(:disabled) { background: #1d4ed8; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}
.lt-btn-save { min-width: 96px; }
.lt-btn-sm { padding: 5px 10px; font-size: 12px; font-weight: 500; }
.lt-btn-ghost { background: transparent; border: 1px solid #444; color: #aaa; &:hover { background: #222; color: #eee; } }

/* Switch ativo */
.lt-switch { position: relative; display: inline-block; width: 38px; height: 20px; }
.lt-switch input { opacity: 0; width: 0; height: 0; }
.lt-slider {
  position: absolute; inset: 0; cursor: pointer;
  background: #444; border-radius: 20px; transition: 0.2s;
  &::before {
    content: ''; position: absolute; height: 14px; width: 14px; left: 3px; bottom: 3px;
    background: #fff; border-radius: 50%; transition: 0.2s;
  }
}
.lt-switch input:checked + .lt-slider { background: #16a34a; }
.lt-switch input:checked + .lt-slider::before { transform: translateX(18px); }
</style>
