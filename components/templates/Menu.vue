<script lang="ts" setup>
</script>

<template>
    <nav class="menu">
        <NuxtLink
            to="/"
            class="link">
            <span class="txt">Home</span>
        </NuxtLink>
        <span class="separe">•</span>
        <NuxtLink
            to="/trabalhos"
            class="link">
            <span class="txt">Trabalhos</span>
        </NuxtLink>
        <span class="separe">•</span>
        <NuxtLink
            to="/estudio"
            class="link">
            <span class="txt">Estúdio</span>
        </NuxtLink>
        <span class="separe">•</span>
        <NuxtLink
            to="/agende-seu-ensaio"
            class="link">
            <span class="txt">Agende seu ensaio</span>
        </NuxtLink>
    </nav>
</template>

<style scoped lang="scss">
.menu {
    &.from-header {
        position: absolute;
        font-size: 35rem;
        bottom: -11rem;
        right: 0;

        @include m.max(md) {
            font-size: 20rem;
        }

        .link {
            color: #832b18;

            &.router-link-active {
                &::before {
                    background: #832b18;
                }
            }
        }

        .separe {
            color: #7b785b;
        }
    }

    &.from-footer {
        font-size: 55rem;

        @include m.max(md) {
            font-size: 29rem;
        }

        .link {
            color: white;

            &.router-link-active {
                &::before {
                    background: white;
                }
            }
        }

        .separe {
            color: white;
        }
    }

    .link {
        text-transform: uppercase;
        font-family: v.$openExtra;
        transition: color 0.2s;

        &.router-link-active {
            &::before {
                content: '';

                transition: background 0.2s;
                position: absolute;
                display: block;
                height: 8rem;
                bottom: 0;
                right: 0;
                left: 0;
            }
        }

        &:hover {
            color: v.$dark-green;

            &::before {
                background: v.$dark-green;
            }
        }
    }

    .separe {
        padding-right: 30rem;
        padding-left: 30rem;

        @include m.max(md) {
            padding-right: 15rem;
            padding-left: 15rem;
        }
    }
}
</style>
