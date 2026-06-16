<script setup lang="ts">
const cfImg = useCfImg()

const scrollRef = ref<HTMLElement | null>(null);

let isDragging = false;
let startX = 0;
let scrollLeft = 0;

function onMouseDown(e: MouseEvent) {
  if (!scrollRef.value) return;
  isDragging = true;
  startX = e.pageX - scrollRef.value.offsetLeft;
  scrollLeft = scrollRef.value.scrollLeft;
  scrollRef.value.style.userSelect = 'none';
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging || !scrollRef.value) return;
  e.preventDefault();
  const x = e.pageX - scrollRef.value.offsetLeft;
  scrollRef.value.scrollLeft = scrollLeft - (x - startX);
}

function onMouseUp() {
  isDragging = false;
  if (scrollRef.value) scrollRef.value.style.userSelect = '';
}

interface Milestone {
  year: number;
  month?: string;
  title: string;
  description: string;
  image?: string;
  format?: string;
}

const milestones: Milestone[] = [
  {
    year: 2019,
    title: 'Espetáculo da Lola',
    description: 'Primeiros registros profissionais em cobertura de espetáculo teatral — o clique que confirmou a vocação.',
    image: '4f6db13c-469a-4636-b6b0-5f3f8dd71100',
  },
  {
    year: 2019,
    title: 'Ensaio na praia',
    description: 'Primeiros ensaios externos com luz natural, descobrindo o retrato feminino como linguagem.',
    image: 'dfef0926-9e7f-4292-3515-f61e93a55600',
  },
  {
    year: 2021,
    month: 'Formação',
    title: 'Etec de Artes',
    description: 'Formação técnica em fotografia pela Etec, construindo a base técnica e artística.',
    image: 'cad71dbd-ff03-467e-b1d6-08d299ce5f00',
  },
  {
    year: 2021,
    month: 'Prêmio',
    title: 'Prêmio Mogi Revela 2021',
    description: 'Ganhadora do 11º Prêmio Mogi Revela de Fotografia — mostra exibida no Centro Cultural de Mogi das Cruzes, um marco no reconhecimento da carreira.',
    image: '67da3987-5e01-4fc9-2417-2c5e2f61ad00',
    format: 'portrait',
  },
  {
    year: 2022,
    month: 'Formação',
    title: 'Senac',
    description: 'Formação técnica em fotografia pelo Senac, reforçando a base técnica e artística.',
  },
  {
    year: 2022,
    month: 'Formação',
    title: 'Senac',
    description: 'Especialização em consultoria de imagem pelo Senac, integrando moda e fotografia.',
  },
  {
    year: 2023,
    title: 'Fashion Week',
    description: 'Cobertura de desfile de moda — experiência de bastidor e fotografia editorial em ritmo acelerado.',
  },
  {
    year: 2024,
    month: 'Junho',
    title: 'Inauguração do Estúdio',
    description: 'Abertura do primeiro estúdio fotográfico próprio em Mogi das Cruzes, com sete cenários exclusivos.',
  },
  {
    year: 2024,
    month: 'Dezembro',
    title: 'Natal 2024',
    description: 'Primeira temporada de Natal no estúdio — cenários temáticos e centenas de famílias fotografadas.',
  },
  {
    year: 2025,
    month: 'Maio',
    title: 'Dia das Mães 2025',
    description: 'Campanha especial para mães e filhos, com ensaios emocionantes e cenários delicados.',
  },
  {
    year: 2025,
    month: 'Junho',
    title: '1 Ano de Estúdio',
    description: 'Um ano de sonho realizado: centenas de ensaios, histórias transformadas e autoestima elevada.',
  },
  {
    year: 2025,
    month: 'Dezembro',
    title: 'Natal 2025',
    description: 'Segunda temporada natalina, com cenários renovados e novos temas exclusivos.',
  },
  {
    year: 2026,
    month: 'Maio',
    title: 'Dia das Mães 2026',
    description: 'Mais uma edição especial celebrando o vínculo entre mães e filhos através da fotografia.',
  },
  {
    year: 2026,
    month: 'Junho',
    title: '2 Anos de Estúdio',
    description: 'Dois anos construindo histórias, revelando beleza e fortalecendo a autoestima de mulheres em Mogi.',
  },
];
</script>

<template>
  <section class="timeline-section">
    <div class="container">
      <h2 class="big-title centered">Nossa história</h2>
      <div class="ac">
        <p class="description">Uma jornada de evolução, aprendizado e muitas histórias fotografadas.</p>
      </div>
    </div>

    <div
      ref="scrollRef"
      class="timeline-scroll-wrapper"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    >
      <div class="timeline-track">

        <div class="timeline-line" aria-hidden="true" />

        <article
          v-for="(item, index) in milestones"
          :key="index"
          class="timeline-item"
          :class="{ 'timeline-item-up': index % 2 === 0 }"
          data-ani-type="fade-up"
        >
          <div class="timeline-card" :class="{ 'card-up': index % 2 === 0 }">
            <nuxt-img
              v-if="item.image"
              provider="cloudflare"
              :src="cfImg(item.image)"
              :alt="item.title"
              :width="item.format === 'portrait' ? 160 : 240"
              :height="item.format === 'portrait' ? 280 : 160"
              format="avif"
              class="timeline-img"
              :class="{ 'timeline-img-portrait': item.format === 'portrait' }"
            />
            <span class="timeline-date">
              <strong>{{ item.year }}</strong>
              <span v-if="item.month"> · {{ item.month }}</span>
            </span>
            <h3 class="timeline-title">{{ item.title }}</h3>
            <p class="description">{{ item.description }}</p>
          </div>

          <div class="timeline-dot" aria-hidden="true" />
        </article>

      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.timeline-section {
  padding: v.$bigSpace 0;
  overflow: hidden;
}

.timeline-heading {
  margin-bottom: 8rem;
}

.ac .description {
  text-align: center;
}

/* ── Scroll container ── */
.timeline-scroll-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  padding: 40rem 32rem 60rem;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  scrollbar-width: thin;
  scrollbar-color: v.$light-beige transparent;

  &::-webkit-scrollbar {
    height: 4rem;
  }

  &::-webkit-scrollbar-thumb {
    background: v.$light-beige;
    border-radius: 4rem;
  }
}

/* ── Horizontal track ── */
.timeline-track {
  display: flex;
  align-items: flex-end;
  position: relative;
  gap: 0;
  min-width: max-content;
  padding-bottom: 20rem;
}

/* ── Continuous line ── */
.timeline-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20rem;
  height: 2rem;
  background: linear-gradient(to right, transparent, v.$light-beige 5%, v.$light-beige 95%, transparent);
  pointer-events: none;
}

/* ── Each milestone column ── */
.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 240rem;
  flex-shrink: 0;
  position: relative;
}

/* ── Card ── */
.timeline-card {
  width: 220rem;
  background: #fff;
  border: 1px solid v.$light-beige;
  border-radius: 6rem;
  padding: 18rem;
  margin-bottom: 16rem;
  box-shadow: 0 2rem 12rem rgba(42, 37, 32, 0.07);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 6rem 24rem rgba(42, 37, 32, 0.14);
    transform: translateY(-4rem);
  }

  /* Alternating: even items go up */
  &.card-up {
    position: absolute;
    bottom: calc(100% + 40rem);
    left: 50%;
    transform: translateX(-50%);

    &:hover {
      transform: translateX(-50%) translateY(-4rem);
    }
  }
}

.timeline-img {
  display: block;
  width: 100%;
  height: 120rem;
  object-fit: cover;
  border-radius: 4rem;
  margin-bottom: 12rem;

  &.timeline-img-portrait {
    height: 245rem;
  }
}

.timeline-date {
  display: block;
  font-size: 12rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: v.$green;
  margin-bottom: 6rem;
}

.timeline-title {
  font-size: 15rem;
  font-weight: 700;
  color: v.$dark-green;
  margin-bottom: 6rem;
  line-height: 1.3;
}

.timeline-desc {
  font-size: 13rem;
  color: #666;
  line-height: 1.55;
}

/* ── Dot on the line ── */
.timeline-dot {
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  background: v.$green;
  border: 3rem solid #fff;
  box-shadow: 0 0 0 2rem v.$green;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  margin-bottom: 13rem;
}

/* ── Mobile: vertical layout ── */
@include m.max(sm) {
  .timeline-scroll-wrapper {
    overflow-x: hidden;
    padding: 20rem 16rem 40rem;
    cursor: default;
  }

  .timeline-track {
    flex-direction: column;
    align-items: flex-start;
    min-width: unset;
    padding-left: 32rem;
    padding-bottom: 0;
    gap: 0;
  }

  .timeline-line {
    left: 14rem;
    top: 0;
    bottom: 0;
    right: auto;
    width: 2rem;
    height: 100%;
    background: linear-gradient(to bottom, transparent, v.$light-beige 5%, v.$light-beige 95%, transparent);
  }

  .timeline-item {
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 28rem;
    left: -24rem;
  }

  .timeline-dot {
    margin-bottom: 0;
    margin-right: 16rem;
    flex-shrink: 0;
    margin-top: 6rem;
    order: 1;
  }

  .timeline-card {
    width: 100%;
    position: static !important;
    transform: none !important;
    margin-bottom: 0;
    order: 2;

    &.card-up {
      position: static !important;
      transform: none !important;
      left: auto;
      bottom: auto;
    }

    &:hover {
      transform: translateY(-2rem) !important;
    }
  }
}
</style>
