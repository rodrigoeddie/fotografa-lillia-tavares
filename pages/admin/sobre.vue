<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const cfImg = useCfImg();
const {
  loading, saving, uploading, uploadImagem, form, servicos, marcos,
  addServico, removeServico, moveServico,
  addMarco, removeMarco, moveMarco,
  init, save,
} = useSobreForm();

const paragrafos = computed(() =>
  form.bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).length,
);

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <h2>Página Sobre</h2>
        <p class="dep-meta">Textos de /sobre-fotografa-lillia-tavares — bio, serviços e "Nossa história"</p>
      </div>
      <a href="/sobre-fotografa-lillia-tavares" target="_blank" class="btn-secondary btn-sm">Ver página ↗</a>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>

    <template v-else>
      <!-- Bio -->
      <div class="form-card">
        <h3 class="form-section-title">Apresentação</h3>
        <div class="form-grid">
          <div class="form-field form-field--full">
            <label>Título da página (H1)</label>
            <input v-model="form.titulo" type="text" placeholder="Sobre a Fotógrafa Lillia Tavares" />
          </div>

          <div class="form-field form-field--full">
            <label>Texto da bio</label>
            <textarea v-model="form.bio" rows="14" placeholder="Um parágrafo por bloco, separados por uma linha em branco." />
            <small class="field-hint">
              Separe os parágrafos com uma linha em branco — {{ paragrafos }} parágrafo{{ paragrafos === 1 ? '' : 's' }} no site.
            </small>
          </div>

          <div class="form-field">
            <label>Foto da bio</label>
            <input type="file" accept="image/*" @change="(e) => uploadImagem(e, (id) => (form.imagem_cf_id = id), 'bio')" />
            <small v-if="uploading === 'bio'" class="field-hint">Enviando...</small>
            <input v-model="form.imagem_cf_id" type="text" class="mt-8" placeholder="ID da imagem no Cloudflare" />
            <img v-if="form.imagem_cf_id" :src="cfImg(form.imagem_cf_id)" class="preview-img" alt="" />
          </div>

          <div class="form-field">
            <label>Texto alternativo da foto</label>
            <input v-model="form.imagem_alt" type="text" placeholder="Fotógrafa Lillia Tavares segurando sua câmera" />
            <div class="dim-grid">
              <label class="dim-field">
                <span>Largura</span>
                <input v-model.number="form.imagem_width" type="number" />
              </label>
              <label class="dim-field">
                <span>Altura</span>
                <input v-model.number="form.imagem_height" type="number" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Serviços -->
      <div class="form-card">
        <div class="form-card-header">
          <h3 class="form-section-title">O que eu ofereço ({{ servicos.length }})</h3>
          <button class="btn-secondary btn-sm" @click="addServico">+ Adicionar card</button>
        </div>

        <div class="form-field form-field--full">
          <label>Título da seção</label>
          <input v-model="form.servicos_titulo" type="text" placeholder="O que eu ofereço" />
        </div>

        <div v-for="(s, i) in servicos" :key="s.id ?? `novo-${i}`" class="bloco">
          <div class="bloco-header">
            <strong>{{ i + 1 }}. {{ s.titulo || '(sem título)' }}</strong>
            <div class="bloco-actions">
              <button class="btn-icon" title="Subir" @click="moveServico(i, -1)">↑</button>
              <button class="btn-icon" title="Descer" @click="moveServico(i, 1)">↓</button>
              <label class="ativo-toggle">
                <input type="checkbox" v-model="s.destaque" />
                <span>Destaque</span>
              </label>
              <label class="ativo-toggle">
                <input type="checkbox" v-model="s.ativo" />
                <span>{{ s.ativo ? 'Ativo' : 'Inativo' }}</span>
              </label>
              <button class="btn-icon btn-danger" @click="removeServico(i)">🗑</button>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label>Título</label>
              <input v-model="s.titulo" type="text" />
            </div>
            <div class="form-field">
              <label>Etiqueta (opcional)</label>
              <input v-model="s.tag" type="text" placeholder="Produto principal" />
            </div>
            <div class="form-field">
              <label>Subtítulo (opcional)</label>
              <input v-model="s.subtitulo" type="text" />
            </div>
            <div class="form-field">
              <label>Texto do botão</label>
              <input v-model="s.cta_label" type="text" placeholder="Ver tipos de ensaio" />
            </div>
            <div class="form-field form-field--full">
              <label>Descrição</label>
              <textarea v-model="s.descricao" rows="3" />
            </div>
            <div class="form-field form-field--full">
              <label>Parágrafo extra (opcional)</label>
              <textarea v-model="s.descricao_extra" rows="2" />
            </div>
            <div class="form-field">
              <label>Link do card</label>
              <input v-model="s.cta_url" type="text" placeholder="/ensaio-fotografico" />
            </div>
            <div class="form-field">
              <label>Link secundário — texto</label>
              <input v-model="s.sub_link_label" type="text" placeholder="Análise de Coloração Pessoal" />
            </div>
            <div class="form-field">
              <label>Link secundário — destino</label>
              <input v-model="s.sub_link_url" type="text" placeholder="/analise-coloracao-pessoal-em-mogi" />
            </div>
          </div>
        </div>
        <p v-if="servicos.length === 0" class="empty-hint">Nenhum card cadastrado.</p>
      </div>

      <!-- Nossa história -->
      <div class="form-card">
        <div class="form-card-header">
          <h3 class="form-section-title">Nossa história ({{ marcos.length }})</h3>
          <button class="btn-secondary btn-sm" @click="addMarco">+ Adicionar marco</button>
        </div>

        <div class="form-grid">
          <div class="form-field">
            <label>Título da seção</label>
            <input v-model="form.timeline_titulo" type="text" placeholder="Nossa história" />
          </div>
          <div class="form-field">
            <label>Linha de apoio</label>
            <input v-model="form.timeline_descricao" type="text" placeholder="Uma jornada de evolução..." />
          </div>
        </div>

        <div v-for="(m, i) in marcos" :key="m.id ?? `novo-${i}`" class="bloco">
          <div class="bloco-header">
            <strong>{{ i + 1 }}. {{ m.ano }}{{ m.mes ? ' · ' + m.mes : '' }} — {{ m.titulo || '(sem título)' }}</strong>
            <div class="bloco-actions">
              <button class="btn-icon" title="Subir" @click="moveMarco(i, -1)">↑</button>
              <button class="btn-icon" title="Descer" @click="moveMarco(i, 1)">↓</button>
              <label class="ativo-toggle">
                <input type="checkbox" v-model="m.ativo" />
                <span>{{ m.ativo ? 'Ativo' : 'Inativo' }}</span>
              </label>
              <button class="btn-icon btn-danger" @click="removeMarco(i)">🗑</button>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label>Ano</label>
              <input v-model.number="m.ano" type="number" />
            </div>
            <div class="form-field">
              <label>Mês / etiqueta</label>
              <input v-model="m.mes" type="text" placeholder="Junho, Prêmio, Formação..." />
            </div>
            <div class="form-field form-field--full">
              <label>Título</label>
              <input v-model="m.titulo" type="text" />
            </div>
            <div class="form-field form-field--full">
              <label>Descrição</label>
              <textarea v-model="m.descricao" rows="2" />
            </div>
            <div class="form-field">
              <label>Imagem (opcional)</label>
              <input type="file" accept="image/*" @change="(e) => uploadImagem(e, (id) => (m.imagem_cf_id = id), `marco-${i}`)" />
              <small v-if="uploading === `marco-${i}`" class="field-hint">Enviando...</small>
              <input v-model="m.imagem_cf_id" type="text" class="mt-8" placeholder="ID da imagem no Cloudflare" />
              <img v-if="m.imagem_cf_id" :src="cfImg(m.imagem_cf_id)" class="preview-img" alt="" />
            </div>
            <div class="form-field">
              <label>Formato da imagem</label>
              <select v-model="m.formato">
                <option value="">Paisagem (padrão)</option>
                <option value="portrait">Retrato</option>
              </select>
            </div>
          </div>
        </div>
        <p v-if="marcos.length === 0" class="empty-hint">Nenhum marco cadastrado.</p>
      </div>

      <div class="form-actions">
        <button class="btn-primary" :disabled="saving" @click="save()">
          {{ saving ? 'Salvando...' : '💾 Salvar' }}
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.form-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.bloco {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.bloco-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.bloco-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ativo-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888;
  cursor: pointer;

  input:checked + span {
    color: #4ade80;
  }
}

.field-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #888;
}

.mt-8 {
  margin-top: 8px;
}

.preview-img {
  width: 100%;
  max-width: 200px;
  border-radius: 6px;
  margin-top: 8px;
}

.dim-grid {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.dim-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  font-size: 12px;
  color: #888;
}
</style>
