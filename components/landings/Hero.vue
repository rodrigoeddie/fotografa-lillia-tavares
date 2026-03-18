
<script setup lang="ts">
const props = defineProps({
  lp: {
    type: String,
    default: false
  }
});
</script>

<template>
    <div class="hero" v-if="props.lp == 'corporativo'">
        <div class="container">
            <div class="wrap">
                <div class="image">
                    <nuxt-img
                        provider="cloudflare"
                        :src='"https://images.fotografalilliatavares.com.br/images/d3d60550-3e27-4c92-77a4-c6b28c596000/public"'
                        :width="'263'"
                        :height="'460'"
                        :alt="'Mulher de terno azul e cabelo cacheado sorrindo, olhando para o lado, com fundo azul'"
                        placeholder />
                </div>
                <div class="text">
                    <nuxtLink to="/" aria-label="Voltar para a página inicial">
                        <nuxt-img
                            provider="cloudflare"
                            :src='"https://images.fotografalilliatavares.com.br/images/de7d6be6-8fed-43b0-e2ca-7b5643bd9d00/public"'
                            :width="'320'"
                            :height="'87'"
                            :alt="'Logotipo Fotografa Lillia Tavares'"
                            placeholder />
                    </nuxtLink>

                    <h1 class="title-hero">Ensaio Fotográfico Profissional<br>em Mogi das Cruzes</h1>
                    <p class="subtitle-hero">Fotos profissionais para LinkedIn, currículos e redes sociais</p>
                    
                    <ul>
                        <li>Direção de poses</li>
                        <li>Estúdio profissional</li>
                        <li>Entrega rápida</li>
                    </ul>
            
                    <a class="btn-hero" href="https://wa.me/5511911159795?text=Olá, gostaria de ver a disponibilidade de um ensaio corporativo (mensagem do site)">
                        <Icon name="icons:whatsapp" class="icon"/>
                        <span>Agendar Ensaio pelo WhatsApp</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .lp-corporativo {
        background: v.$lp-corporativo;
    }

    .wrap {
        justify-content: center;
        align-items: flex-end;
        padding-top: 20rem;
        display: flex;

        @include m.max(sm) {
            flex-direction: column-reverse;
            align-items: center;
        }

        .image {
            @include m.max(sm) {
                width: 70%;
            }
                
            img {
                height: auto;
            }
        }

        .text {
            padding-bottom: 90rem;
            padding-left: 30rem;
            padding-top: 30rem;
            
            @include m.max(sm) {
                padding-right: 30rem;
                padding-bottom: 20rem;
                padding-top: 0;
            }

            .title-hero {
                text-transform: uppercase;
                font-size: 32rem;
                color: #EAEAEA;
                padding-top: 30rem;
                font-weight: 700;
            }

            .subtitle-hero {
                color: #CDE2FE;
                font-size: 22rem;
                margin-top: 20rem;
                margin-bottom: 30rem;
            }
            
            ul {
                padding-left: 20rem;
                color: #CDE2FE;
                font-size: 19rem;

                li {
                    list-style: disc;
                }
            }

            .btn-hero {
                transition: box-shadow .3s ease, background .3s ease;
                box-shadow: 5rem 5rem 0 white;
                border-radius: 8rem;
                font-size: 25rem;
                border: 3rem solid white;
                padding: 20rem 30rem;
                align-items: center;
                font-weight: bold;
                display: inline-flex;
                color: white;
                margin-top: 60rem;
                gap: 15rem;
                
                @include m.max(sm) {
                    margin-top: 30rem;
                    font-size: 22rem;
                    padding: 21rem;
                }

                .icon {
                    font-size: 40rem;
                }
                
                &:hover {
                    box-shadow: 10rem 10rem 0 white;
                    background: black;
                }
            }
        }
    }
</style>
