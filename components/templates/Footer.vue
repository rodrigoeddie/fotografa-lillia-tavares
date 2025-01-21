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
                src="assets/images/logo-lillia-tavares-fotografia.png"
                alt="Logo Lillia Tavares Fotografia"
                width="370"
                loading="lazy"/>
                <span>Fotógrafa Lillia Tavares</span>
            </NuxtLink>

            <TemplatesSocial class="from-footer" />
        </header>
        <footer>
            <TemplatesMenu class="from-footer" />
        </footer>
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
        }

        .logo {
            width: 370rem;

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
        height: 420rem;
        display: flex;

        @include m.max(md) {
            height: 200rem;
        }
    }
</style>
