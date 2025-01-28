<script lang="ts" setup>
    const { gtag } = useGtag();

    const clickLogo = () => {
    gtag('event', 'click-logo', {
        app_name: 'Site',
        screen_name: 'Footer'
    })
    }
</script>

<template>
    <div class="wrap-footer">
        <header>
            <NuxtLink
              to="/"
              @click="clickLogo"
              class="logo">
                <nuxt-img
                  src="https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/054a1bce-78a3-4e53-7afa-a30d92e86500/logo"
                  alt="Logo Lillia Tavares Fotografia"
                  width="370"
                  class="logo-black"
                  loading="lazy"/>
                
                <nuxt-img
                  src="https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/8a01bb94-bd4f-4e5b-aecf-b260b8726e00/logo"
                  alt="Logo Lillia Tavares Fotografia"
                  width="385"
                  class="logo-white"
                  loading="lazy"/>
                <span>Fotógrafa Lillia Tavares</span>
            </NuxtLink>

            <TemplatesSocial class="from-footer" />
        </header>
        <footer>
            <TemplatesMenu class="from-footer" />
        </footer>

        <address>Copyright® <b>Fotógrafa Lillia Tavares</b> - Todos os direitos reservados</address>
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

        @media (prefers-color-scheme: dark) {
            background: v.$dark-red;
        }

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

            @media (prefers-color-scheme: dark) {
                background-image:  linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, v.$dark-red 1px);
                background-color: v.$dark-red;
            }
        }

        .logo {
            width: 370rem;

            .logo-black {
                @media (prefers-color-scheme: dark) {
                    display: none;
                }
            }

            .logo-white {
                display: none;

                @media (prefers-color-scheme: dark) {
                    display: block;
                }
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
        background: #832b18;
        align-items: center;
        text-align: center;
        flex-wrap: wrap;
        height: 420rem;
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
        font-size: 16px;
        padding: 20px;
        color: v.$red;
        width: 100%;
    
        @media (prefers-color-scheme: dark) {
        color: v.$dark-red;
        }
    }
</style>
