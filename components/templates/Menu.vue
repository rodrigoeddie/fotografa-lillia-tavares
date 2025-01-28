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

        @include m.max(sm) {
            flex-direction: column;
            align-items: flex-end;
            font-size: 14px;
            height: 100rem;
            display: flex;
            bottom: auto;
            width: 70dvw;
            gap: 3px;
            top: 0;
        }

        .link {
            color: #832b18;

            @media (prefers-color-scheme: dark) {
                color: white;
            }

            @include m.max(sm) {
                display: inline-block;
                padding-right: 20px;
                padding-top: 11px;
                line-height: 1em;
            }

            &.router-link-active {
                &::before {
                    background: #832b18;
                }
            }
        }

        .separe {
            color: #7b785b;

            @include m.max(sm) {
                display: none;
            }
        }
    }

    &.from-footer {
        font-size: 55rem;

        @include m.max(md) {
            font-size: 29rem;
        }

        @include m.max(sm) {
            font-size: 16px;
            width: 100dvw;
        }

        .link {
            color: white;

            @include m.max(sm) {
                display: block;
            }

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

                @include m.max(sm) {
                    content: none;
                }
            }

            @include m.max(sm) {
                display: none;
            }
        }

        &:hover {
            color: v.$dark-green;

            @media (prefers-color-scheme: dark) {
                color: black;
            }

            &::before {
                background: v.$dark-green;

                @media (prefers-color-scheme: dark) {
                    background: black;
                }
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
