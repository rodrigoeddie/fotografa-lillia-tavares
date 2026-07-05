<script setup lang="ts">
const cfImg = useCfImg();

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {}
  },
  breadcrumbs: {
    type: Array as PropType<{ label: string; to?: string }[]>,
    default: undefined
  }
});

/* breadcrumb fallback: build from route if not provided via prop */
const route = useRoute();
const workPage = '/' + (route.path.split('/')[1] || '');
const workPageLabel = computed(() => {
  const s = workPage.replace(/\//g, '').replace(/-/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
});

const breadcrumbItems = computed(() => {
  if (props.breadcrumbs) return props.breadcrumbs;

  const items: { label: string; to?: string }[] = [
    { label: 'Home', to: '/' },
    { label: workPageLabel.value, to: workPage },
  ];
  if (props.data.category) {
    items.push({
      label: props.data.category.title,
      to: workPage + '/' + props.data.category.slug,
    });
  }
  items.push({ label: props.data.title });
  return items;
});

/* highlights: fotos marcadas como destaque, ou a imagem única */
const highlight = computed(() => {
  let list: any[] = [];

  if (props.data.album && Array.isArray(props.data.album)) {
    list = props.data.album
      .map((item: any, index: number) => ({ ...item, index }))
      .filter((item: any) => item.highlight);
  }

  if (list.length === 0 && props.data.image) {
    list = [{ ...props.data.image, index: 0 }];
  }

  return list;
});

/* mídia do lado direito: vídeo (se houver) + até 2 destaques */
const mediaCells = computed(() => {
  const cells: any[] = [];
  const imgs = highlight.value;

  if (props.data.video) {
    cells.push({ type: 'video', html: props.data.video });
    if (imgs[0]) cells.push({ type: 'image', img: imgs[0] });
  } else {
    if (imgs[0]) cells.push({ type: 'image', img: imgs[0] });
    if (imgs[1]) cells.push({ type: 'image', img: imgs[1] });
  }

  return cells;
});

/* barra de meta que ancora o bloco (rodapé estrutural) */
const metaItems = computed(() => {
  const d = props.data;
  const items: any[] = [];

  if (d.category) {
    items.push({
      icon: 'mdi:folder',
      label: 'Categoria',
      value: d.category.title,
      to: workPage + '/' + d.category.slug,
    });
  }
  if (d.date) {
    items.push({ icon: 'mdi:calendar', label: 'Data', value: formatDate(d.date) });
  }
  if (d.local) {
    items.push({ icon: 'mdi:map-marker', label: 'Local', html: d.local });
  }
  if (d.site) {
    items.push({ icon: 'mdi:link', label: 'Site', value: 'Acessar', href: d.site });
  }
  if (d.instagram) {
    items.push({ icon: 'mdi:instagram', label: 'Instagram', value: d.instagram.title, href: d.instagram.uri });
  }

  return items;
});

/* quebra o nome: última palavra em bloco colorido (igual ao modelo) */
const titleParts = computed(() => {
  const raw = (props.data.title ?? '').toString().trim();
  const words = raw.split(/\s+/);
  if (words.length < 2) return { head: '', tail: raw };
  return { head: words.slice(0, -1).join(' '), tail: words[words.length - 1] };
});

/* estrelas do depoimento (1–5) */
const stars = computed(() => {
  const r = Number(props.data.testimonial?.rating) || 5;
  return Math.min(Math.max(r, 1), 5);
});

/* rótulo do CTA da galeria */
const photoCount = computed(() =>
  Array.isArray(props.data.album) ? props.data.album.length : 0
);

const scrollToGallery = () => {
  if (import.meta.server) return;
  const el =
    document.querySelector('#galeria') ||
    document.querySelector('.wrap-hero')?.nextElementSibling;
  el?.scrollIntoView({ behavior: 'smooth' });
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';

  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
};
</script>

<template>
  <div
    class="wrap-hero"
    data-ani-type="fade-up">
    <div class="text">
      <BlocksBreadcrumb :items="breadcrumbItems" :schema="!breadcrumbs" />

      <div class="hero-body text-slide">
        <p class="eyebrow" v-if="data.category">{{ data.category.title }}</p>

        <h1 class="title">
          <template v-if="titleParts.head">{{ titleParts.head }} </template>
          <span>{{ titleParts.tail }}</span>
        </h1>

        <div class="rule"></div>

        <div class="description" v-html="data.description"></div>

        <figure class="quote" v-if="data.testimonial">
          <span
            class="stars"
            role="img"
            :aria-label="`Avaliação ${stars} de 5 estrelas`">
            <template v-for="n in stars" :key="n">★</template>
          </span>

          <blockquote v-html="data.testimonial.text"></blockquote>

          <cite>
            <NuxtLink
              v-if="data.testimonial.link"
              :to="data.testimonial.link"
              target="_blank"
              rel="noopener noreferrer">
              <Icon name="mdi:google" class="icon" />
              <span>Avaliação no {{ data.testimonial.source || 'Google' }}</span>
            </NuxtLink>
            <template v-else>
              <Icon name="mdi:google" class="icon" />
              <span>Avaliação no {{ data.testimonial.source || 'Google' }}</span>
            </template>
          </cite>
        </figure>

        <div class="ctas">
          <NuxtLink
            to="/agende-seu-ensaio"
            class="cta primary"
            data-track-event="cta-agendar-interna">
            <Icon name="mdi:calendar" class="icon" />
            <span>Agendar meu ensaio</span>
          </NuxtLink>

          <button
            v-if="photoCount"
            type="button"
            class="cta ghost"
            @click="scrollToGallery">
            <Icon name="mdi:camera" class="icon" />
            <span>Ver as {{ photoCount }} fotos</span>
          </button>
        </div>
      </div>
    </div>

    <div class="wrap-img-hero">
      <div
        class="photos"
        :class="{ single: mediaCells.length < 2 }">
        <div
          v-for="(cell, index) in mediaCells"
          :key="index"
          class="cell">
          <div
            v-if="cell.type === 'video'"
            class="video"
            v-html="cell.html"></div>

          <nuxt-img
            v-else
            provider="cloudflare"
            :src="cfImg(cell.img.imageId)"
            :width="cell.img.width"
            :height="cell.img.height"
            :alt="cell.img.alt"
            placeholder
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            :loading="index === 0 ? 'eager' : 'lazy'" />
        </div>

        <ul class="meta" v-if="metaItems.length">
          <li
            v-for="(item, index) in metaItems"
            :key="index"
            class="m">
            <NuxtLink v-if="item.to" :to="item.to">
              <Icon :name="item.icon" class="icon" />
              <span class="mt">
                <span class="ml">{{ item.label }}</span>
                <span class="mv">{{ item.value }}</span>
              </span>
            </NuxtLink>

            <a
              v-else-if="item.href"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer">
              <Icon :name="item.icon" class="icon" />
              <span class="mt">
                <span class="ml">{{ item.label }}</span>
                <span class="mv">{{ item.value }}</span>
              </span>
            </a>

            <div v-else>
              <Icon :name="item.icon" class="icon" />
              <span class="mt">
                <span class="ml">{{ item.label }}</span>
                <span class="mv" v-if="item.html" v-html="item.html"></span>
                <span class="mv" v-else>{{ item.value }}</span>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
/* ═══ Hero interna — 01 Editorial Quente ═══ */

.wrap-hero {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  min-height: 600rem;
  background: v.$cream-light;

  @include m.max(sm) {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  /* ─── coluna de texto sobre creme ─── */
  .text {
    display: flex;
    flex-direction: column;
    padding: 40rem 48rem 0;
    background: v.$cream-light;

    @include m.max(sm) {
      padding: 32rem 26rem 0;
    }

    nav[aria-label="breadcrumb"] {
      padding-top: 0;
      margin-bottom: 24rem;

      .breadcrumb {
        padding-left: 0;
      }

      li,
      a {
        color: v.$green;
      }

      a:hover {
        color: var(--color-highlight, v.$rose-deep);
      }

      li.active {
        color: v.$dark-green;
      }
    }
  }

  .hero-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-bottom: 40rem;

    @include m.max(sm) {
      padding-bottom: 32rem;
    }
  }

  .eyebrow {
    font-size: 13rem;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-highlight, v.$rose-deep);
    margin-bottom: 14rem;
  }

  .title {
    font-family: v.$openExtra;
    font-weight: 900;
    text-transform: uppercase;
    line-height: 0.98;
    letter-spacing: -0.015em;
    color: v.$dark-green;
    font-size: clamp(40rem, 4.6vw, 58rem);

    span {
      display: block;
      color: var(--color-highlight, v.$rose-deep);
    }
  }

  .rule {
    width: 52rem;
    height: 3rem;
    background: var(--color-highlight, v.$rose-deep);
    margin: 22rem 0;
  }

  .description {
    font-size: 16rem;
    line-height: 1.75;
    color: #5c534a;
    margin-bottom: 26rem;

    @include m.max(sm) {
      font-size: 17rem;
      line-height: 1.7;
    }

    p + p {
      padding-top: 12rem;
    }

    a {
      color: var(--color-highlight, v.$rose-deep);
      text-decoration: underline;
    }

    strong,
    b,
    em {
      color: var(--color-highlight, v.$rose-deep);
      font-style: italic;
      font-weight: 700;
    }
  }

  /* ─── depoimento como blockquote citável ─── */
  .quote {
    border-left: 3rem solid var(--color-highlight, v.$rose-deep);
    background: v.$light-green;
    padding: 18rem 20rem;
    margin-bottom: 28rem;

    .stars {
      display: block;
      color: #f9a825;
      letter-spacing: 2rem;
      font-size: 18rem;
      margin-bottom: 8rem;
    }

    blockquote {
      font-style: italic;
      font-size: 16rem;
      line-height: 1.7;
      color: #5c534a;
    }

    cite {
      display: block;
      margin-top: 10rem;

      a,
      span {
        display: inline-flex;
        align-items: center;
        gap: 7rem;
        font-style: normal;
        font-size: 12rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-highlight, v.$rose-deep);
      }

      a:hover {
        text-decoration: underline;
      }

      .icon {
        font-size: 15rem;
      }
    }
  }

  /* ─── CTAs acima da dobra ─── */
  .ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 12rem;
    margin-top: auto;

    @include m.max(xs) {
      flex-direction: column;
      align-items: stretch;
    }

    .cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9rem;
      font-family: v.$openExtra;
      font-weight: 700;
      font-size: 15rem;
      padding: 14rem 22rem;
      min-height: 48rem;
      border-radius: 8rem;
      border: 2rem solid transparent;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease, color 0.18s ease;

      .icon {
        font-size: 18rem;
      }

      &.primary {
        background: var(--color-highlight, v.$rose-deep);
        color: white;
        box-shadow: 0 8rem 22rem -10rem rgba(0, 0, 0, 0.5);

        &:hover {
          transform: translateY(-2rem);
          box-shadow: 0 12rem 26rem -10rem rgba(0, 0, 0, 0.55);
        }

        &:active {
          transform: translateY(0);
        }
      }

      &.ghost {
        background: transparent;
        color: var(--color-highlight, v.$rose-deep);
        border-color: #ded8c7;

        &:hover {
          border-color: var(--color-highlight, v.$rose-deep);
          background: rgba(0, 0, 0, 0.04);
        }
      }
    }
  }

  /* ─── coluna de imagens + barra de meta ─── */
  .wrap-img-hero {
    display: flex;
    background: v.$cream-light;

    @include m.max(sm) {
      width: 100%;
    }

    .photos {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      width: 100%;

      &.single {
        grid-template-columns: 1fr;
      }

      @include m.max(xs) {
        grid-template-columns: 1fr;
      }
    }

    .cell {
      overflow: hidden;

      @include m.max(sm) {
        aspect-ratio: 3 / 4;
      }

      img {
        object-fit: cover;
        height: 100%;
        width: 100%;
        transition: transform 0.6s ease;
      }

      &:hover img {
        transform: scale(1.04);
      }

      .video {
        height: 100%;
        width: 100%;

        iframe {
          height: 100%;
          width: 100%;
          border: 0;
        }
      }
    }

    /* barra de meta que ancora o bloco */
    .meta {
      grid-column: 1 / -1;
      display: flex;
      flex-wrap: wrap;
      background: var(--color-highlight, v.$dark-green);

      .m {
        display: flex;
        flex: 1;
        min-width: 180rem;
        border-right: 1rem solid rgba(255, 255, 255, 0.14);

        &:last-child {
          border-right: none;
        }

        a,
        > div {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 13rem;
          padding: 18rem 28rem;
          text-decoration: none;
          transition: background 0.18s ease;
        }

        a:hover {
          background: rgba(0, 0, 0, 0.16);
        }

        .icon {
          font-size: 18rem;
          color: rgba(255, 255, 255, 0.7);
          flex-shrink: 0;
        }

        .mt {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ml {
          font-size: 11rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.78);
        }

        .mv {
          font-size: 15rem;
          font-weight: 700;
          color: white;

          p {
            display: inline;
            margin: 0;
            padding: 0;
          }
        }
      }
    }
  }
}
</style>
