<script setup lang="ts">
const isMobile = ref(false);

onMounted(() => {
  if (process.client) {
    const checkMobile = () => {
      return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    isMobile.value = checkMobile();
    
    // Listener para mudanças de tela
    const handleResize = () => {
      isMobile.value = checkMobile();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
  }
});

const { data: navigation } = await useAsyncData('portfolio-hero-navigation', () => {
  return queryCollectionNavigation('works');
});

const categories = await Promise.all(
  navigation.value[0].children.map(async (category) => {
    const path = category.children[1]?.path;

    if (path) {
      const pageData = await queryCollection('works').path(path).first();

      const paisagemSlides = pageData.album
        .filter(slide => slide.format === 'paisagem' && slide.canBeThumb === true)
        .slice(0, 1);

      category.image = paisagemSlides[0];
    }

    return category;
  })
);
</script>

<template>
  <div>
    <div class="container intro-hero">
      <nav class="menu-category container">
        <NuxtLink
          to="/ensaio-fotografico"
          class="link-category link-category-all"
          :class="{'mobile': isMobile, 'desktop': !isMobile}">
          <span class="category-label">Todas</span>
        </NuxtLink>

        <template v-for="item in categories">
          <NuxtLink
            :to="item.path"
            class="link-category"
            :class="{'mobile': isMobile, 'desktop': !isMobile}">
            <span class="category-label">{{ item.title }}</span>
          </NuxtLink>
        </template>
      </nav>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  &.sbs {
    display: flex;

    @include m.max(sm) {
      flex-direction: column;
    }
  }
}

.intro-hero {
  padding: v.$space 0;
  display: flex;

  @include m.max(sm) {
    position: static;
    width: 100%;
  }

  .text {
    justify-content: flex-end;
    flex-direction: column;
    background: white;
    position: absolute;
    flex-shrink: 0;
    display: flex;
    width: 45%;
    bottom: 0;
    right: 0;
    top: 0;

    @include m.max(lg) {
      width: 50%;
    }

    @include m.max(sm) {
      width: 100%;
    }
  }
}

.menu-category {
  justify-content: center;
  flex-wrap: wrap;
  display: flex;
  width: 100%;
  gap: 15rem;
}

.link-category {
  font-size: 22rem;
  line-height: 1em;
  display: flex;
  align-items: center;
  background: white;
  padding: 10rem 20rem;
  border-radius: 5rem;
  border: 1px solid v.$red;
  color: v.$red;
  transition: background-color 0.2s, color 0.2s;

  @include m.max(sm) {
    font-size: 18rem;
  }

  .category-label {
    z-index: 2;
  }

  &.router-link-active {
    background-color: v.$red;
    color: white;
  }

  &.desktop:not(.router-link-active):hover {
    background: transparent;
  }
}

.wrap-highlights {
  width: 55%;

  @include m.max(sm) {
    aspect-ratio: 1.35/1;
    height: 100%;
    width: 100%;
  }

  .about-ctas {
    color: var(--color-highlight, v.$dark-green);
    position: absolute;
    bottom: 30rem;
    left: 130rem;
    z-index: 2;

    @include m.max(sm) {
      background-color: v.$dark-green;
      height: 60rem;
      left: 100rem;
      width: 100%;
      bottom: 0;
      right: 0;
    }

    .btn {
      @include m.max(sm) {
        justify-content: flex-start;
        padding-left: 25rem;
        position: absolute;
        width: 100%;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
      }
    }
  }

  .about-highlight {
    background-color: var(--color-highlight, v.$dark-green);
    transform: rotate(-90deg);
    transform-origin: 0 0;
    padding-left: 30rem;
    padding-top: 20rem;
    position: absolute;
    color: white;
    height: 100rem;
    z-index: 2;
    top: 100%;
    bottom: 0;
    right: 0;
    left: 0;

    .description {
      padding-top: 0;

      @include m.max(sm) {
        font-size: 12px;
      }
    }

    // .btn {
    //   // color: var(--color-highlight, v.$dark-green);
    //   margin-top: 10rem;
    //   font-size: 35rem;
    //   display: none;
    // }
  }

  .img-hero {
    position: absolute;
    object-fit: cover;
    display: block;
    height: 100%;
    width: 100%;

    @include m.max(sm) {
      height: calc(100% - 60rem);
    }
  }
}
</style>
