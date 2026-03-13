<script lang="ts" setup>
</script>

<template>
  <div data-ani-type="fade" class="wrap-services">
    <div class="text">
      <h1 class="title">Serviços</h1>
      <br>

      <h2>Ensaios Fotográficos</h2>
      <ul>
        <li><NuxtLink to="/ensaio-fotografico/corporativo">Corporativo</NuxtLink></li>
        <li><NuxtLink to="/ensaio-fotografico/sensual-intimista">Sensual / Intimista</NuxtLink></li>
        <li>
          <span class="list-title">Família</span>
          <ul>
            <li><NuxtLink to="/ensaio-fotografico/dia-das-maes-2025">Dia das Mães 2025</NuxtLink></li>
          </ul>
        </li>
        <!-- <li><NuxtLink to="/ensaio-fotografico/gestante">Gestante</NuxtLink></li>
        <li><NuxtLink to="/ensaio-fotografico/aniversario">Aniversário</NuxtLink></li>
        <li><NuxtLink to="/ensaio-fotografico/casal">Casal</NuxtLink></li> -->
      </ul>

      <h2>Estúdio</h2>
      <ul>
        <li><NuxtLink to="/estudio">Locação para outros fotógrafos</NuxtLink></li>
      </ul>
    </div>

    <nuxt-img
      provider="cloudflare"
      :src='"https://images.fotografalilliatavares.com.br/images/2214a3b9-fa58-43d3-95d7-e9e981cfef00/public"'
      alt="Fotógrafa Lillia Tavares segurando sua câmera fotográfica"
      width="500"
      fetchpriority="high"
      preload
      format="webp"
      placeholder
      class="img cover"/>
  </div>
</template>

<style scoped lang="scss">
  .img {
    left: auto;
    z-index: 1;
    max-width: 71%;
    
    @include m.max(xs) {
      object-position: 38%;
      max-width: 40%;
      left: 0;
      right: 0;
    }
  }

  .wrap-services {
    box-shadow: 0 0 10rem rgba(0, 0, 0, 0.1);
    background: white;
    // background: rgba(72, 83, 73, 0.2);
    max-width: 860rem;
    padding: v.$space;
    color: v.$green;
    width: 50%;

    @include m.max(xs) {
      width: 100%;
      display: flex;
      justify-content: right;
      padding-bottom: 15rem;
    }
  }

  .text {
    position: relative;
    z-index: 2;
  }

  h1 {
    background: white;
    display: inline-block;
    padding-right: 10rem;

    @include m.max(xs) {
      font-size: 13px;
    }
  }
  
  h2 {
    font-weight: bold;
    padding-right: 10rem;
    background: white;
    padding-bottom: 6rem;
    font-size: 22rem;
    margin-top: 15rem;
    padding-top: 5rem;
    display: inline-block;
    
    @include m.max(xs) {
      margin-top: 8rem;
    }
  }

  ul {
    font-size: 18rem;
    padding-left: 25rem;

    .list-title {
      background-color: white;
      font-weight: bold;
      z-index: 2;
    }

    li {
      list-style-type: disc;

      a {
        background-color: white;
        display: inline-block;
        padding: 5rem 10rem 5rem 0;

        &:hover {
          background: #f7f4e8;
        }
      }

      ul {
        padding-top: 3rem;
      }
    }
  }
</style>