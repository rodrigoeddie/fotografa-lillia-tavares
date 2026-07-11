<script lang="ts" setup>
    const cfImg = useCfImg()
    const { whatsappUrl } = useRuntimeConfig().public

    const { trackEvent } = useTracking();

    const clickLogo = () => trackEvent('click-logo', { screen_name: 'Footer' });
    const clickCta = () => trackEvent('click-whats', { screen_name: 'Footer' });

    const props = defineProps({
        lp: {
            type: String,
            default: ''
        },
        logo: {
            type: String,
            default: '19bd6c18-a153-4e79-c6bd-4293145da400'
        }
    });
</script>

<template>
    <div class="wrap-footer" data-component="templates/footer">
        <div class="footer-split">
            <div class="footer-left">
                <div class="footer-top">
                    <NuxtLink
                      to="/"
                      @click="clickLogo"
                      class="logo"
                      aria-label="Voltar para a página inicial">
                        <nuxt-img
                            provider="cloudflare"
                            :src="cfImg(props.logo)"
                            alt="Logotipo Lillia Tavares Fotografia"
                            width="390"
                            height="107"
                            class="logo-black"
                            format="avif"
                            fetchpriority="high"
                            preload
                            placeholder />
                        <span>Fotógrafa Lillia Tavares</span>
                    </NuxtLink>

                    <TemplatesSocial class="from-footer" />
                </div>

                <TemplatesMenu class="from-footer" :fromFooter="true" />
            </div>

            <div class="footer-right">
                <span class="cta-label">Pronta para o seu ensaio?</span>
                <p class="cta-heading">Vamos criar algo inesquecível juntas.</p>
                <NuxtLink
                  :to="`${whatsappUrl}?text=Olá, vim pelo seu site e queria agendar um ensaio...`"
                  class="cta-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="clickCta">
                    <Icon name="icons:whatsapp" class="icon" />
                    <span>Agendar meu ensaio</span>
                </NuxtLink>

                <a
                  href="https://maps.app.goo.gl/2NPyJTUvUs9z12fW7"
                  target="_blank"
                  rel="noopener"
                  class="cta-loc">
                    <Icon name="icons:location-pin-solid" class="icon" />
                    <span class="cta-loc-text">
                        <strong>Mogi das Cruzes, SP · Alto Tietê</strong>
                        Av. Ver. Narciso Yague Guimarães, 124 — Sala 21 
                        Vila Partenio · CEP 08780-200
                    </span>
                </a>
            </div>
        </div>

        <address class="footer-bar">
            <span>Copyright® <b>Fotógrafa Lillia Tavares</b> - Todos os direitos reservados</span>
            <NuxtLink to="/privacidade-e-termos" class="privacy-link">Privacidade e Termos</NuxtLink>
        </address>
    </div>
</template>

<style scoped lang="scss">
    @use 'sass:color';

    /* olive-dark quente do painel de CTA (≈ #4a4836) — branco/creme passa AA */
    $panel: color.adjust(v.$green, $lightness: -15%);

    .footer-split {
        border-top: 3rem solid v.$light-beige;
        grid-template-columns: 1fr 38%;
        background: v.$cream;
        display: grid;

        @include m.max(sm) {
            grid-template-columns: 1fr;
        }
    }

    .footer-left {
        justify-content: space-between;
        flex-direction: column;
        padding: 44rem 40rem;
        align-items: flex-start;
        display: flex;
        gap: 32rem;

        @include m.max(md) {
            padding: 32rem 24rem;
            gap: 28rem;
        }

        .footer-top {
            flex-direction: column;
            align-items: flex-start;
            display: flex;
            gap: 22rem;
            width: 100%;
        }

        .logo {
            width: 260rem;

            @include m.max(md) {
                width: 220rem;
            }

            img {
                height: auto;
            }

            span {
                text-indent: -9999px;
                position: absolute;
                display: block;
            }
        }
    }

    .footer-right {
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 44rem 40rem;
        background: v.$rose-deep;
        display: flex;
        gap: 18rem;

        @include m.max(sm) {
            align-items: center;
            text-align: center;
            padding: 40rem 28rem;
        }

        .cta-label {
            text-transform: uppercase;
            letter-spacing: .16em;
            color: v.$light-green;
            font-weight: 700;
            font-size: 13rem;
        }

        .cta-heading {
            font-family: v.$serif-pessoal;
            font-style: italic;
            font-weight: 400;
            color: v.$cream;
            font-size: 27rem;
            line-height: 1.2;
            text-wrap: balance;
        }

        .cta-btn {
            transition: background .2s, transform .12s;
            text-transform: uppercase;
            background: v.$cream;
            letter-spacing: .06em;
            border-radius: 999px;
            margin-top: 4rem;
            padding: 14rem 26rem;
            align-items: center;
            color: $panel;
            font-weight: 900;
            font-size: 15rem;
            display: inline-flex;
            gap: 8rem;

            .icon {
                font-size: 22rem;
            }

            &:hover {
                transform: translateY(-2px);
                background: white;
            }
        }

        .cta-loc {
            transition: color .2s;
            color: v.$light-green;
            align-items: flex-start;
            margin-top: 10rem;
            font-size: 12.5rem;
            line-height: 1.55;
            display: flex;
            gap: 8rem;

            @include m.max(sm) {
                justify-content: center;
            }

            .icon {
                color: rgba(255, 255, 255, .55);
                flex-shrink: 0;
                margin-top: 3rem;
                font-size: 14rem;
            }

            .cta-loc-text {
                color: rgba(255, 255, 255, .72);

                strong {
                    text-transform: uppercase;
                    letter-spacing: .04em;
                    display: block;
                    color: white;
                    font-weight: 700;
                    font-size: 13rem;
                    margin-bottom: 3rem;
                }
            }

            &:hover .cta-loc-text {
                color: white;
            }
        }
    }

    .footer-bar {
        border-top: 1px solid v.$light-beige;
        justify-content: space-between;
        background: white;
        flex-wrap: wrap;
        font-style: normal;
        align-items: center;
        color: v.$green;
        font-size: 17rem;
        padding: 16rem 35rem;
        display: flex;
        gap: 10rem;

        @include m.max(sm) {
            justify-content: center;
            text-align: center;
            font-size: 12px;
        }

        .privacy-link {
            text-decoration: underline;
            color: inherit;
            opacity: 0.7;

            &:hover {
                opacity: 1;
            }
        }
    }

    /* ─── Temas de LP: painel de CTA + barra adotam a paleta da landing ─── */
    .lp-corporativo {
        .footer-right {
            background: v.$lp-corporativo;

            .cta-btn {
                color: v.$lp-corporativo;
            }
        }

        .footer-bar {
            background: rgba(16, 28, 44, 0.08);
        }
    }

    .lp-dia-das-maes {
        .footer-right {
            background: v.$lp-dia-das-maes-dark;

            .cta-btn {
                color: v.$lp-dia-das-maes-dark;
            }
        }

        .footer-bar {
            background: rgba(157, 126, 105, 0.12);
        }
    }

    .lp-presentes {
        .footer-right {
            background: v.$lp-presentes-dark;

            .cta-btn {
                color: v.$lp-presentes-dark;
            }
        }

        .footer-bar {
            background: rgba(139, 94, 107, 0.12);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .footer-right .cta-btn {
            transition: none;
        }
    }
</style>
