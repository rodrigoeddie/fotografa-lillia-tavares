<script lang="ts" setup>
    const configPublic = useRuntimeConfig().public;
    const { gtag } = useGtag();

    const clickLogo = () => {
        gtag('event', 'click-logo', {
            app_name: 'Site',
            screen_name: 'Footer'
        })
    }

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
        <header>
            <NuxtLink
              to="/"
              @click="clickLogo"
              class="logo"
              aria-label="Voltar para a página inicial">
                <nuxt-img
                    provider="cloudflare"
                    :src='"https://images.fotografalilliatavares.com.br/images/" + props.logo + "/public"'
                    alt="Logotipo Lillia Tavares Fotografia"
                    width="390"
                    height="107"
                    class="logo-black"
                    format="webp"
                    fetchpriority="high"
                    preload
                    placeholder />  
                <span>Fotógrafa Lillia Tavares</span>
            </NuxtLink>

            <TemplatesSocial class="from-footer" />
        </header>

        <footer>
            <TemplatesMenu class="from-footer" :fromFooter="true" />
        </footer>

        <address>
            <span>Copyright® <b>Fotógrafa Lillia Tavares</b> - Todos os direitos reservados</span>
            <NuxtLink to="/privacidade-e-termos" class="privacy-link">Privacidade e Termos</NuxtLink>
        </address>
    </div>
</template>

<style scoped lang="scss">
    header {
        padding-bottom: v.$space;
        justify-content: center;
        flex-direction: column;
        padding-top: v.$space;
        align-items: center;
        background: white;
        display: flex;
        gap: v.$space;

        // @media (prefers-color-scheme: dark) {
        //     background: v.$dark-red;
        // }

        @include m.max(md) {
            gap: 20rem;
        }

        &:before {
            content: '';

            background-image:  linear-gradient(#7B785B 1px, transparent 1px), linear-gradient(to right, #7B785B 1px, #ffffff 1px);
            background-color: #ffffff;
            background-size: 20px 20px;
            position: absolute;
            opacity: 0.05;
            bottom: 0;
            right: 0;
            left: 0;
            top: 0;

            // @media (prefers-color-scheme: dark) {
            //     background-image:  linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, v.$dark-red 1px);
            //     background-color: v.$dark-red;
            // }
        }

        .logo {
            width: 370rem;

            img {
                height: auto;
            }

            @include m.max(md) {
                width: 245rem;
            }

            span {
                text-indent: -9999px;
                display: block;
                position: absolute;
            }
        }
    }

    footer {
        justify-content: center;
        // background: v.$green;
        background: rgba(72, 83, 73, 0.2);
        align-items: center;
        text-align: center;
        flex-wrap: wrap;
        height: 320rem;
        display: flex;

        @include m.max(md) {
            padding-bottom: 20px;
            padding-top: 20px;
            height: auto;
        }
    }

    address {
        font-style: normal;
        text-align: center;
        color: v.$green;
        font-size: 16px;
        padding: 20px;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 8px;

        @include m.max(sm) {
            font-size: 12px;
        }

        .privacy-link {
            font-size: 13px;
            opacity: 0.7;
            text-decoration: underline;
            color: inherit;

            &:hover {
                opacity: 1;
            }

            @include m.max(sm) {
                font-size: 11px;
            }
        }
    }

    .lp-corporativo {
        footer {
            background: rgba(16, 28, 44, 0.1);
        }

        header {
            background-color: v.$lp-corporativo;

            &:before {
                display: none;
            }
        }

        :deep(.social) {
            .link-social {
                color: white;
            }

            .icon-whatsapp * {
                stroke: white !important;
            }
    
            .icon {
                fill: white;
            }
        }

        :deep(.menu) .link,
        address {
            color: v.$lp-corporativo !important;
        }
    }

    .lp-dia-das-maes {
        footer {
            background: rgba(157, 126, 105, 0.1);
        }

        header {
            background-color: v.$lp-dia-das-maes;

            &:before {
                display: none;
            }
        }

        :deep(.social) {
            .link-social {
                color: white;
            }

            .icon-whatsapp * {
                stroke: white !important;
            }
    
            .icon {
                fill: white;
            }
        }

        :deep(.menu) .link,
        address {
            color: v.$lp-dia-das-maes !important;
        }
    }

    .lp-presentes {
        footer {
            background: rgba(139, 94, 107, 0.1);
        }

        header {
            background-color: v.$lp-presentes;

            &:before {
                display: none;
            }
        }

        :deep(.social) {
            .link-social {
                color: white;
            }

            .icon-whatsapp * {
                stroke: white !important;
            }
    
            .icon {
                fill: white;
            }
        }

        :deep(.menu) .link,
        address {
            color: v.$lp-presentes !important;
        }
    }
</style>
