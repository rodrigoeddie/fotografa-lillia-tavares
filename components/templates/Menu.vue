<script lang="ts" setup>
const isMobile = ref(false);

onMounted(() => {
  if (process.client) {
    const checkMobile = () => {
      return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    isMobile.value = checkMobile();

    const handleResize = () => {
      isMobile.value = checkMobile();
    };

    window.addEventListener('resize', handleResize);

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
  }
});

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
          class="menu"
          :class="{
            'opened': isOpen, 
            'not-opened': !isOpen,
            'hidden': !props.fromFooter && isMobile && !isOpen
          }">
            <NuxtLink
                to="/"
                class="link"
                @click="isOpen = false">
                <span class="txt">Home</span>
            </NuxtLink>
            <span class="separe">•</span>

            <NuxtLink
                to="/sobre"
                class="link"
                @click="isOpen = false">
                <span class="txt">Sobre</span>
            </NuxtLink>
            <span class="separe">•</span>

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

            <NuxtLink
                to="/blog"
                class="link"
                @click="isOpen = false">
                <span class="txt">Blog</span>
            </NuxtLink>
            <span class="separe">•</span>

            <NuxtLink
                to="/preco-ensaio-fotografico"
                class="link"
                @click="isOpen = false">
                <span class="txt">Agende seu ensaio</span>
            </NuxtLink>
        </nav>

        <button
          v-if="!props.fromFooter"
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
        @include m.min(xs) {
            height: 100%;
        }

        @include m.max(xs) {
            position: absolute;
            top: 11px;
            right: 0;
        }

        .menu {
            font-size: 25rem;

            @include m.min(xs) {
                height: 100%;
            }

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
                opacity: 0;
                pointer-events: none;
                visibility: hidden;
            }
            
            &.opened {
                opacity: 1;
                pointer-events: auto;
                visibility: visible;
            }

            .link {
                transition: left .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                color: black;
     
                @include m.min(xs) {
                    display: inline-flex;
                    align-items: center;
                    height: 100%;
                }

                @include m.max(xs) {
                    left: -60px;
                }

                &:nth-child(1) {
                    transition-delay: .035s;
                }
                &:nth-child(2) {
                    transition-delay: .045s;
                }
                &:nth-child(3) {
                    transition-delay: .055s;
                }
                &:nth-child(4) {
                    transition-delay: .065s;
                }
                &:nth-child(5) {
                    transition-delay: .075s;
                }
                &:nth-child(6) {
                    transition-delay: .085s;
                }
                &:nth-child(7) {
                    transition-delay: .095s;
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
                    pointer-events: none;

                    &::before {
                        background: black;
                    }
                }

                &:hover{
                    &::before {
                        background: #f4f2e9;
                        height: 100%;
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
                color: #d8d4c5;
                padding: 0;

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
        padding-right: 20rem;
        padding-left: 20rem;
        font-weight: 900;

        &::before {
            content: '';

            transition: background .2s, height .2s;
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
    position: absolute;
    cursor: pointer;
    z-index: 1001;
    display: none;
    height: 40px;
    border: none;
    width: 55px;
    top: -8px;
    right: 0;

    @include m.max(sm) {
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
