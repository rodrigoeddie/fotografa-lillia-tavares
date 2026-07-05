
<script setup lang="ts">
const { whatsappUrl } = useRuntimeConfig().public
</script>

<template>
    <div class="social">
        <NuxtLink
          to="https://www.instagram.com/fotografalilliatavares/"
          target="_blank"
          aria-label="Instagram: @fotografalilliatavares"
          class="link-social">
          <Icon
            name="icons:instagram"
            class="icon icon-instagram"/>
          <span class="txt-social">@fotografalilliatavares</span>
        </NuxtLink>

        <NuxtLink
          to="mailto:fotografalilliatavares@gmail.com"
          class="link-social"
          aria-label="Email: fotografalilliatavares@gmail.com">
          <Icon
            name="icons:email"
            class="icon icon-email"/>
          <span class="txt-social">fotografalilliatavares@gmail.com</span>
        </NuxtLink>

        <NuxtLink
          :to="whatsappUrl"
          class="link-social icon-whatsapp"
          target="_blank"
          aria-label="Telefone: (11) 91115-9795">
          <Icon
            name="icons:whatsapp"
            class="icon"/>
          <span class="txt-social">(11) 91115-9795</span>
        </NuxtLink>
    </div>
</template>

<style scope lang="scss">
@use 'sass:color';

.social {
    justify-content: flex-end;
    align-items: center;
    display: flex;

    &.from-header {
        .link-social {
            font-size: 15rem;
        }
    }

    &.from-footer {
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 6rem 4rem;

        @include m.max(sm) {
            justify-content: center;
        }

        .link-social {
            padding: 6rem 12rem 6rem 0;
            font-weight: 500;
            font-size: 17rem;
            height: auto;
            gap: 7rem;

            &:hover {
                background: none;
                color: v.$dark-green;
            }
        }

        .icon svg {
            height: 18rem;
            width: 18rem;
        }
    }

    .link-social {
        transition: background .2s, color .2s;
        align-items: center;
        font-family: v.$open;
        color: v.$green;
        font-weight: 600;
        font-size: 21rem;
        padding: 0 20rem;
        display: flex;
        height: 35rem;
        gap: 10rem;

        // @media (prefers-color-scheme: dark) {
        //     color: white;
        // }

        .txt-social {
            @include m.max(xs) {
                display: none;
            }
        }

        &:hover {
            background: color.scale(v.$beige, $lightness: 20%);

            // @media (prefers-color-scheme: dark) {
            //     background: black;
            // }

            .icon {
                transition: fill .2s, stroke .2s;
            }
        }
    }

    .icon {
        svg {
            height: 30rem;
            width: 30rem;
            fill: v.$green;
        }
    }
}

.icon-whatsapp * {
    stroke: v.$dark-green !important;

    // @media (prefers-color-scheme: dark) {
    //     stroke: white !important;
    // }
}
</style>
