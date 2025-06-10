<script lang="ts" setup>
const { isMobile } = useDevice();

const props = defineProps({
  fromFooter: {
    type: Boolean,
    required: false,
    default: false
  }
});

const isOpen = ref(false);

function toggleMenu() {
    isOpen.value = !isOpen.value;
}
</script>

<template>
    <div>
        <nav
          :class="{
            'opened': isOpen, 
            'not-opened': !isOpen,
            'visible': props.fromFooter || !isMobile || (isOpen && isMobile),
            'hidden': !props.fromFooter && isMobile && !isOpen
          }"
          class="menu">
            <NuxtLink
                to="/"
                class="link"
                @click="isOpen = false">
                <span class="txt">Home</span>
            </NuxtLink>
            <span class="separe">•</span>
            <!--
                <NuxtLink
                    to="/sobre"
                    class="link"
                    @click="isOpen = false">
                    <span class="txt">Sobre</span>
                </NuxtLink>
            
            <span class="separe">•</span>-->
            <NuxtLink
                to="/ensaio-fotografico"
                class="link"
                @click="isOpen = false">
                <span class="txt">Trabalhos</span>
            </NuxtLink>
            <span class="separe">•</span>
            <NuxtLink
                to="/estudio"
                class="link"
                @click="isOpen = false">
                <span class="txt">Estúdio</span>
            </NuxtLink>
            <span class="separe">•</span>
            <!-- <NuxtLink
                to="/blog"
                class="link"
                @click="isOpen = false">
                <span class="txt">Blog</span>
            </NuxtLink>
            <span class="separe">•</span> -->
            <NuxtLink
                to="/preco-ensaio-fotografico"
                class="link"
                @click="isOpen = false">
                <span class="txt">Agende seu ensaio</span>
            </NuxtLink>
        </nav>

        <button
          v-if="!props.fromFooter && isMobile"
          class="hamburger"
          :aria-expanded="isOpen"
          aria-label="Abrir menu"
          @click="toggleMenu"
        >
            <span :class="{ open: isOpen }"></span>
            <span :class="{ open: isOpen }"></span>
            <span :class="{ open: isOpen }"></span>
        </button>

        <div
          :class="{
            'opened': isOpen, 
            'not-opened': !isOpen,
            'visible': props.fromFooter || (isOpen && isMobile),
            'hidden': !props.fromFooter && (!isOpen || !isMobile)
          }"
          class="overlay"></div>
    </div>
</template>

<style scoped lang="scss">
    .from-header {
        .menu {
            font-size: 25rem;

            @include m.max(lg) {
                right: 20px;
            }

            @include m.max(md) {
                font-size: 20rem;
                right: 0;
            }

            @include m.max(xs) {
                flex-direction: column;
                align-items: flex-end;
                position: absolute;
                padding-right: 0;
                font-size: 14px;
                height: 100rem;
                display: flex;
                bottom: auto;
                width: 70dvw;
                z-index: 2;
                top: 59px;
                right: 0;
                gap: 5px;
            }

            &.hidden {
                opacity: 0;
                pointer-events: none;
                visibility: hidden;
            }
            
            &.visible {
                opacity: 1;
                pointer-events: auto;
                visibility: visible;
            }

            .link {
                color: black;
                transition: left .4s;

                @include m.max(xs) {
                    left: -60px;
                }

                &:nth-child(1) {
                    transition-delay: .03s;
                }
                &:nth-child(2) {
                    transition-delay: .04s;
                }
                &:nth-child(3) {
                    transition-delay: .05s;
                }
                &:nth-child(4) {
                    transition-delay: .06s;
                }
                &:nth-child(5) {
                    transition-delay: .07s;
                }
                &:nth-child(6) {
                    transition-delay: .08s;
                }
                &:nth-child(7) {
                    transition-delay: .09s;
                }

                &:last-child {
                    padding-right: 0;

                    @include m.max(xs) {
                        padding-right: 30px;
                    }
                }

                @include m.max(sm) {
                    display: inline-block;
                    padding-right: 20px;
                    padding-top: 11px;
                    line-height: 1em;
                }
                @include m.max(xs) {
                    background: white;
                    padding: 15px 30px;
                }

                &.router-link-active {
                    &::before {
                        background: black;
                    }
                }
            }

            &.opened {
                .link {
                    @include m.max(xs) {
                        left: 0;
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

        .overlay {
            background: rgba(73, 22, 22, 0.3);
            backdrop-filter: blur(4px);
            transition: opacity .3s;
            position: fixed;
            opacity: 0;
            z-index: 1;
            bottom: 0;
            right: 0;
            left: 0;
            top: 0;

            &.hidden {
                opacity: 0;
                pointer-events: none;
                visibility: hidden;
            }
            
            &.visible {
                opacity: 1;
                pointer-events: auto;
                visibility: visible;
            }
        }
    }

    .from-footer {
        .menu {
            font-size: 45rem;

            @include m.max(lg) {
                font-size: 40rem;
            }

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
    }

    .link {
        text-transform: uppercase;
        font-family: v.$openExtra;
        transition: color 0.2s;
        font-weight: 900;

        &.router-link-active {
            &::before {
                content: '';

                transition: background 0.2s;
                position: absolute;
                display: block;
                height: 4rem;
                bottom: 0;
                right: 0;
                left: 0;

                @include m.max(sm) {
                    content: none;
                }
            }

            // @include m.max(sm) {
            //     display: none;
            // }
        }

        &:hover {
            color: v.$dark-green;

            // @media (prefers-color-scheme: dark) {
            //     color: black;
            // }

            &::before {
                background: v.$dark-green;

                // @media (prefers-color-scheme: dark) {
                //     background: black;
                // }
            }
        }
    }

    .separe {
        padding-right: 20rem;
        padding-left: 20rem;

        @include m.max(md) {
            padding-right: 15rem;
            padding-left: 15rem;
        }
    }


.hamburger {
    background: transparent;
    justify-content: center;
    flex-direction: column;
    padding-right: 15px;
    cursor: pointer;
    display: none;
    height: 40px;
    border: none;
    z-index: 1001;
    width: 55px;

    @media (max-width: 768px) {
        display: flex;
    }

    span {
        background: v.$dark-green;
        border-radius: 2px;
        transition: 0.3s;
        display: block;
        margin: 4px 0;
        height: 4px;
        width: 100%;
    }

    &[aria-expanded="true"] span {
        background: black;
    }

    span.open:nth-child(1) {
        transform: translateY(12px) rotate(45deg);
    }
    span.open:nth-child(2) {
        opacity: 0;
    }
    span.open:nth-child(3) {
        transform: translateY(-12px) rotate(-45deg);
    }
}
</style>
