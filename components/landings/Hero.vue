
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
                <div class="image" data-ani-type="fade-left" data-ani-delay="0.3s">
                    <nuxt-img
                        provider="cloudflare"
                        :src='"https://images.fotografalilliatavares.com.br/images/d3d60550-3e27-4c92-77a4-c6b28c596000/public"'
                        :width="'263'"
                        :height="'460'"
                        :alt="'Mulher de terno azul e cabelo cacheado sorrindo, olhando para o lado, com fundo azul'"
                        placeholder
                        fetchpriority="high" />
                </div>
                <div class="text" data-ani-type="fade-right" data-ani-delay="0.3s">
                    <nuxtLink to="/" aria-label="Voltar para a página inicial">
                        <nuxt-img
                            provider="cloudflare"
                            :src='"https://images.fotografalilliatavares.com.br/images/de7d6be6-8fed-43b0-e2ca-7b5643bd9d00/public"'
                            :width="'320'"
                            :height="'87'"
                            :alt="'Logotipo Fotografa Lillia Tavares'"
                            class="logo"
                            placeholder
                            fetchpriority="high" />
                    </nuxtLink>

                    <h1 class="title-hero">Ensaio Fotográfico Profissional<br>em Mogi das Cruzes</h1>
                    <p class="subtitle-hero">Fotos profissionais para LinkedIn e redes sociais que transmitem confiança</p>
                    
                    <ul>
                        <li>Direção de poses</li>
                        <li>Estúdio profissional</li>
                        <li>Entrega rápida</li>
                    </ul>
            
                    <a class="btn-hero" href="https://wa.me/5511911159795?text=Olá, gostaria de ver a disponibilidade de um ensaio corporativo (mensagem do site)">
                        <Icon name="icons:whatsapp" class="icon"/>
                        <span>Agendar Ensaio</span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="hero container" v-else-if="props.lp == 'dia-das-maes'">
            <div class="wrap">
                <div class="image" data-ani-type="fade-left" data-ani-delay="0.3s">
                    <nuxt-img
                        provider="cloudflare"
                        :src='"https://images.fotografalilliatavares.com.br/images/4b44edc8-39bf-46ba-9a6e-1257badcd700/public"'
                        :width="'2000'"
                        :alt="'Menino de costas para sua mãe, ambos sorrindo, com fundo bege, eles estão sentados no chão, a mãe tem um vestido vermelho e o menino uma camisa marrom'"
                        placeholder
                        fetchpriority="high" />
                </div>

                    <div class="text" data-ani-type="fade-right" data-ani-delay="0.3s">
                        <nuxtLink to="/" aria-label="Voltar para a página inicial">
                            <nuxt-img
                                provider="cloudflare"
                                :src='"https://images.fotografalilliatavares.com.br/images/4cb733c9-64af-48fd-2578-c43f3a26d800/public"'
                                :width="'320'"
                                :height="'87'"
                                :alt="'Logotipo Fotografa Lillia Tavares'"
                                class="logo"
                                placeholder
                                fetchpriority="high" />
                        </nuxtLink>

                        <h1 class="title-hero">O presente que ela vai <br>guardar para sempre</h1>
                        <p class="subtitle-hero">Um ensaio fotográfico profissional <br>em Mogi das Cruzes.<br>Porque a sua mãe merece se ver<br>da forma como você a enxerga.</p>
                        
                        <ul>
                            <li>Direção de poses</li>
                            <li>Estúdio profissional</li>
                            <li>Entrega rápida</li>
                        </ul>
                
                        <a class="btn-hero" href="https://wa.me/5511911159795?text=Olá, gostaria de ver a disponibilidade de um ensaio de dia das mães (mensagem do site)">
                            <Icon name="icons:whatsapp" class="icon"/>
                            <span>Quero presentear com um ensaio →</span>
                        </a>
                    </div>
            </div>
        </div>
</template>

<style scoped lang="scss">
    .hero {
        overflow: hidden;
    }

    .wrap {
        justify-content: center;
        align-items: flex-end;
        padding-top: 20rem;
        display: flex;

        .logo {
            @include m.max(sm) {
                width: 300rem;
                height: auto;
            }
        }

        .image {
            @include m.max(sm) {
                text-align: center;
                flex-shrink: 0;
                width: 42%;
                margin-left: -9%;
            }
                
            img {
                height: auto;

                @include m.max(sm) {
                    max-width: 291rem;
                    width: 122%;
                }
            }
        }

        .text {
            padding-bottom: 90rem;
            padding-left: 30rem;
            padding-top: 30rem;
            
            @include m.max(sm) {
                padding-left: 0;
                padding-right: 30rem;
                padding-bottom: 30rem;
                padding-top: 0;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }

            .title-hero {
                text-transform: uppercase;
                font-size: 32rem;
                color: #EAEAEA;
                padding-top: 30rem;
                font-weight: 700;
  
                @include m.max(sm) {
                    font-size: 25rem;
                    text-align: right;
                }
            }

            .subtitle-hero {
                font-size: 22rem;
                margin-top: 20rem;
                margin-bottom: 30rem;
  
                @include m.max(sm) {
                    font-size: 20rem;
                    text-align: right;
                }
            }
            
            ul {
                padding-left: 20rem;
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
                    padding: 10rem 21rem;
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

    .lp-corporativo {
        background: v.$lp-corporativo;

        .wrap {
            .text {
                ul,
                .subtitle-hero {
                    color: v.$lp-corporativo-ultralight;
                }
            }
        }
    }

    .lp-dia-das-maes {
        background: v.$lp-dia-das-maes;

        .wrap {
            justify-content: flex-start;

            &:before {
                content: '';

                background: linear-gradient(90deg, rgba(157, 126, 105, 1), transparent);
                pointer-events: none;
                position: absolute;
                z-index: 1;
                bottom: 0;
                right: 50%;
                left: 0;
                top: 0;
            }

            .text {
                padding-right: 40rem;
                z-index: 2;

                ul,
                .subtitle-hero {
                    color: white;
                }

                .btn-hero {
                    background: rgba(v.$lp-dia-das-maes, 0.65);

                    &:hover {
                        border-color: v.$lp-dia-das-maes-dark;
                        color: v.$lp-dia-das-maes-dark;
                        box-shadow: 10rem 10rem 0 v.$lp-dia-das-maes-dark;
                        background: white;
                    }
                }
            }
        }

        .image {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            
            img {
                object-position: 100%;
                object-fit: cover;
                height: 100%;
                width: 100%;
            }
        }
    }
</style>
