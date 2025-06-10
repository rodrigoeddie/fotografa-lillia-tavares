<script setup lang="ts">
</script>

<template>
    <div class="wrap-map">
        <h2 class="title title-map">Estamos localizados em <a href="https://maps.app.goo.gl/2NPyJTUvUs9z12fW7" target="_blank" class="highlight light"><span>Mogi das cruzes, SP</span>. <nuxt-icon name="external-link" class="icon"/></a></h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14634.106001989638!2d-46.1804627!3d-23.5135586!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cdd92db136d28b%3A0x7dbfca477fd7474f!2sEst%C3%BAdio%20fotogr%C3%A1fico%20Lillia%20Tavares%20em%20Mogi%20das%20Cruzes!5e0!3m2!1spt-BR!2sbr!4v1724005767992!5m2!1spt-BR!2sbr"
          width="100%"
          height="600"
          style="border:0;"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    </div>
</template>

<style lang="scss">
    .wrap-map {
        width: 100%;

        @include m.max(md) {
            height: 100vw;
        }
    }

    .title-map {
        padding: 40rem 0 20rem;
        text-align: center;
        display: block;
        width: 100%;

        .icon {
            font-size: 14rem;
            top: -2rem;
        }

        a {
            transition: background-color 0.2s, color 0.2s;
            background: #f4f2e9;
            padding: 3rem 7rem;

            // @media (prefers-color-scheme: dark) {
            //     background: v.$dark-red;
            // }

            span {
                text-decoration: underline;
            }

            &:hover {
                background-color: v.$red;
                color: white;
            }
        }
    }
</style>