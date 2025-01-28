
<template>
    <div class="social">
        <NuxtLink
          to="https://www.instagram.com/fotografalilliatavares/"
          target="_blank"
          class="link-social">
          <nuxt-icon
            name="instagram"
            class="icon icon-instagram"/>
          <span class="txt-social">@fotografalilliatavares</span>
        </NuxtLink>

        <NuxtLink
          to="mailto:fotografalilliatavares@gmail.com"
          class="link-social">
          <nuxt-icon
            name="email"
            class="icon icon-email"/>
          <span class="txt-social">fotografalilliatavares@gmail.com</span>
        </NuxtLink>

        <NuxtLink
          to="https://wa.me/5511911159795"
          class="link-social icon-whatsapp"
          target="_blank">
          <nuxt-icon
            name="whatsapp"
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
        .link-social {
            @include m.max(md) {
                font-size: 15rem;
            }
        }
    }

    .link-social {
        transition: background .2s, color .2s;
        align-items: center;
        font-family: v.$open;
        color: v.$dark-red;
        font-weight: 600;
        font-size: 21rem;
        padding: 0 20rem;
        display: flex;
        height: 35rem;
        gap: 10rem;

        @media (prefers-color-scheme: dark) {
            color: white;
        }

        .txt-social {
            @include m.max(xs) {
                display: none;
            }
        }

        &:hover {
            background: color.scale(v.$beige, $lightness: 20%);

            @media (prefers-color-scheme: dark) {
                background: black;
            }

            .icon {
                transition: fill .2s, stroke .2s;
            }
        }
    }

    .icon {
        svg {
            height: 30rem;
            width: 30rem;
            fill: v.$red;
        }
    }
}

.icon-whatsapp * {
    stroke: v.$dark-red !important;

    @media (prefers-color-scheme: dark) {
        stroke: white !important;
    }
}
</style>
