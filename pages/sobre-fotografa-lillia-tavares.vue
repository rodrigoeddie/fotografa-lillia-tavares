<script setup lang="ts">
const { data: sobre } = await useAsyncData('sobre-page', () => {
  return queryCollection('content').path('/pages/sobre').first()
});

const pageData = computed(() => sobre.value as any);

useSeoMeta({
  title: pageData.value?.title + ' - Lillia Tavares Fotografia',
  description: pageData.value?.description || '',
  ogTitle: pageData.value?.title + ' - Lillia Tavares Fotografia',
  ogDescription: pageData.value?.description || '',
  ogImage: `https://images.fotografalilliatavares.com.br/images/${pageData.value?.image?.id || '5aaf1433-aaa7-42ed-7198-15626f964000'}/public`,
  ogType: 'website'
});

useHead({
  title: pageData.value?.title + ' - Lillia Tavares Fotografia'
});
</script>

<template>
  <SectionsSobreContent />
</template>

<style lang="scss" scoped>
.container {
  max-width: 1200rem;
  margin: 0 auto;
  padding: 0 24rem;
}

.sobre-header {
  text-align: center;
  margin-bottom: 48rem;
  
  &__title {
    font-size: 40rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 16rem;
    
    @include m.max(sm) {
      font-size: 28rem;
    }
  }
}

.sobre-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48rem;
  margin-bottom: 64rem;
  
  @include m.max(md) {
    grid-template-columns: 1fr;
    gap: 32rem;
  }
}

.sobre-image {
  .img-sobre {
    width: 100%;
    height: auto;
    border-radius: 8rem;
    box-shadow: 0 4rem 12rem rgba(0, 0, 0, 0.1);
  }
}

.sobre-text {
  :deep(.markdown-content) {
    h2 {
      font-size: 28rem;
      font-weight: 600;
      color: #333;
      margin-top: 32rem;
      margin-bottom: 16rem;
      
      &:first-child {
        margin-top: 0;
      }
      
      @include m.max(sm) {
        font-size: 24rem;
      }
    }
    
    h3 {
      font-size: 22rem;
      font-weight: 600;
      color: #333;
      margin-top: 24rem;
      margin-bottom: 12rem;
      
      @include m.max(sm) {
        font-size: 20rem;
      }
    }
    
    p {
      font-size: 16rem;
      line-height: 1.8;
      color: #666;
      margin-bottom: 16rem;
    }
    
    ul {
      list-style: none;
      padding-left: 0;
      margin-bottom: 24rem;
      
      li {
        font-size: 16rem;
        line-height: 1.8;
        color: #666;
        margin-bottom: 12rem;
        padding-left: 24rem;
        position: relative;
        
        &:before {
          content: "•";
          color: v.$red;
          font-weight: bold;
          font-size: 20rem;
          position: absolute;
          left: 0;
        }
        
        strong {
          color: #333;
          font-weight: 600;
        }
      }
    }
    
    a {
      color: v.$red;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
      
      &:hover {
        color: v.$dark-red;
        text-decoration: underline;
      }
    }
  }
}

.sobre-cta {
  text-align: center;
  padding: 48rem 0;
  background: #f9f9f9;
  border-radius: 8rem;
  margin-top: 48rem;
  
  h2 {
    font-size: 32rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rem;
    
    @include m.max(sm) {
      font-size: 24rem;
    }
  }
  
  p {
    font-size: 18rem;
    color: #666;
    margin-bottom: 32rem;
    
    @include m.max(sm) {
      font-size: 16rem;
    }
  }
  
  &__button {
    display: inline-block;
    padding: 16rem 40rem;
    background: v.$red;
    color: #fff;
    text-decoration: none;
    border-radius: 4rem;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      background: v.$dark-red;
      transform: translateY(-2rem);
      box-shadow: 0 4rem 12rem rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
