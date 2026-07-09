<script lang="ts" setup>
interface MenuItem {
  label: string;
  path: string;
  blank: boolean;
  children?: MenuItem[];
}

const isMobile = ref(false);
const isMounted = ref(false);

const { data: menu } = await useFetch<MenuItem[]>('/api/public/menu', {
  key: 'menu',
});

onMounted(() => {
  isMounted.value = true;
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
const openSubmenu = ref<number | null>(null);

function toggleMenu() {
    isOpen.value = !isOpen.value;
    if (!isOpen.value) openSubmenu.value = null;
}

function toggleSubmenu(idx: number) {
    openSubmenu.value = openSubmenu.value === idx ? null : idx;
}

function closeAll() {
    isOpen.value = false;
    openSubmenu.value = null;
}

function onItemEnter(idx: number) {
    if (!props.fromFooter && !isMobile.value) openSubmenu.value = idx;
}

function onItemLeave(idx: number) {
    if (!props.fromFooter && !isMobile.value && openSubmenu.value === idx) openSubmenu.value = null;
}
</script>

<template>
    <div>
        <nav
          id="main-nav"
          class="menu"
          aria-label="Navegação principal"
          :class="{
            'opened': isOpen,
            'not-opened': !isOpen,
            'hidden': !props.fromFooter && isMounted && isMobile && !isOpen
          }"
          @keydown.escape="openSubmenu = null">
            <template v-for="(item, idx) in menu" :key="item.path + idx">
                <div
                  v-if="item.children?.length"
                  class="item has-children"
                  :class="{ 'submenu-open': openSubmenu === idx }"
                  @mouseenter="onItemEnter(idx)"
                  @mouseleave="onItemLeave(idx)">
                    <span class="item-row">
                        <NuxtLink
                          :to="item.path"
                          class="link"
                          @click="closeAll">
                            <span class="txt">{{ item.label }}</span>
                        </NuxtLink>
                        <button
                          v-if="!props.fromFooter"
                          type="button"
                          class="submenu-toggle"
                          :aria-expanded="openSubmenu === idx"
                          :aria-controls="`submenu-${idx}`"
                          :aria-label="(openSubmenu === idx ? 'Fechar submenu ' : 'Abrir submenu ') + item.label"
                          @click="toggleSubmenu(idx)">
                            <span class="chevron" aria-hidden="true"></span>
                        </button>
                    </span>

                    <div
                      v-show="props.fromFooter || openSubmenu === idx"
                      :id="`submenu-${idx}`"
                      class="submenu">
                        <NuxtLink
                          v-for="child in item.children"
                          :key="child.path"
                          :to="child.path"
                          :target="child.blank ? '_blank' : undefined"
                          :rel="child.blank ? 'noopener noreferrer' : undefined"
                          class="sublink"
                          @click="closeAll">
                            {{ child.label }}
                        </NuxtLink>
                    </div>
                </div>

                <NuxtLink
                  v-else
                  :to="item.path"
                  :target="item.blank ? '_blank' : undefined"
                  :rel="item.blank ? 'noopener noreferrer' : undefined"
                  class="link"
                  :class="{ 'button': item.blank }"
                  @click="closeAll">
                    <span class="txt">{{ item.label }}</span>
                    <Icon
                        v-if="item.blank"
                        name="icons:external"
                        class="icon icon-external"/>
                </NuxtLink>
            </template>
        </nav>

        <button
          v-if="!props.fromFooter"
          class="hamburger"
          :aria-expanded="isOpen"
          :aria-label="isOpen ? 'Fechar menu' : 'Abrir menu'"
          aria-controls="main-nav"
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

    @include m.max(sm) {
        position: absolute;
        top: 11px;
        right: 0;
    }

    .menu {
        font-size: 22rem;

        @include m.min(xs) {
            height: 100%;
        }

        @include m.max(md) {
            font-size: 20rem;
            right: 0;
        }

        @include m.max(sm) {
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

        .item {
            position: relative;

            @include m.min(xs) {
                display: inline-flex;
                flex-direction: column;
                justify-content: center;
                height: 100%;
            }

            @include m.max(sm) {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                width: 100%;
            }

            .item-row {
                display: inline-flex;
                align-items: center;

                @include m.min(xs) {
                    height: 100%;
                }

                @include m.max(sm) {
                    justify-content: flex-end;
                }
            }

            .submenu-toggle {
                background: transparent;
                align-items: center;
                cursor: pointer;
                display: flex;
                border: none;
                padding: 8rem;
                color: v.$green;

                @include m.max(sm) {
                    background: white;
                    align-self: stretch;
                    padding: 0 15px;
                }

                .chevron {
                    transition: transform .2s;
                    border-right: 2px solid currentColor;
                    border-bottom: 2px solid currentColor;
                    transform: rotate(45deg);
                    margin-top: -4rem;
                    display: block;
                    height: 8rem;
                    width: 8rem;
                }

                &[aria-expanded="true"] .chevron {
                    transform: rotate(-135deg);
                    margin-top: 4rem;
                }

                &:hover {
                    color: v.$dark-green;
                }
            }

            .submenu {
                @include m.min(xs) {
                    box-shadow: 0 14rem 30rem -12rem rgba(42, 37, 32, 0.35);
                    border-top: 3rem solid v.$green;
                    flex-direction: column;
                    position: absolute;
                    background: white;
                    min-width: 240rem;
                    padding: 10rem 0;
                    display: flex;
                    z-index: 10;
                    top: 100%;
                    left: 0;
                }

                @include m.max(sm) {
                    flex-direction: column;
                    align-items: flex-end;
                    position: static;
                    display: flex;
                    width: 100%;
                }
            }

            .sublink {
                text-transform: uppercase;
                font-family: v.$openExtra;
                transition: background .2s, color .2s;
                padding: 12rem 20rem;
                color: v.$green;
                font-weight: 900;
                font-size: 16rem;
                display: block;

                @include m.max(sm) {
                    background: #f4f2e9;
                    text-align: right;
                    padding: 12px 30px;
                    font-size: 13px;
                    width: 100%;
                }

                &:hover,
                &.router-link-active {
                    background: #f4f2e9;
                    color: v.$dark-green;

                    @include m.max(sm) {
                        background: v.$light-green;
                    }
                }
            }
        }

        .link {
            transition: left .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            color: v.$green;

            @include m.min(xs) {
                display: inline-flex;
                align-items: center;
                height: 100%;
            }

            @include m.max(sm) {
                left: -60px;
            }

            @include m.max(sm) {
                display: inline-block;
                padding-right: 20px;
                line-height: 1em;
                background: white;
                padding: 15px 30px;
            }

            &.router-link-active {
                &::before {
                    background: v.$green;
                }
            }

            &:hover{
                &::before {
                    background: #f4f2e9;
                    height: 100%;
                }
            }

            &:after {
                color: #d8d4c5;
                right: -6rem;
                padding: 0;

                @include m.max(sm) {
                    display: none;
                }
            }

            &.button {
                transition: box-shadow .3s ease;
                border: 1px solid v.$green;
                background: #f4f2e9;
                border-radius: 10rem;
                display: inline-flex;
                align-items: center;
                overflow: hidden;
                padding: 15px;
                height: 27px;
                left: 18rem;

                @include m.max(sm) {
                    display: inline-table;
                    height: 50px;
                }

                &:hover {
                    box-shadow:
                      0 1px 0 rgba(42, 37, 32, 0.9),
                      0 14px 30px -12px rgba(42, 37, 32, 0.5),
                      0 4px 10px -4px rgba(42, 37, 32, 0.5);
                }
            }
        }

        @for $i from 1 through 8 {
            > :nth-child(#{$i}) {
                &.link,
                .link {
                    transition-delay: #{0.025 + $i * 0.01}s;
                }
            }
        }

        &.opened {
            .link {
                @include m.max(sm) {
                    left: 0;
                }
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
    &:before {
        @include m.max(sm) {
            content: '';

            background: rgba(255, 255, 255, .5);
            transform: translateX(-50%);
            position: absolute;
            display: block;
            height: 100%;
            width: 1px;
            left: 50%;
        }
    }

    .menu {
        border-top: 1px solid v.$light-beige;
        padding-top: 24rem;
        letter-spacing: .06em;
        font-size: 13rem;
        display: flex;
        flex-wrap: wrap;
        width: 100%;

        @include m.max(sm) {
            font-size: 14px;
            width: 100%;
        }

        .item {
            flex-direction: column;
            display: flex;

            @include m.max(sm) {
                width: 50%;
            }

            .item-row {
                display: flex;
            }

            .submenu {
                flex-direction: column;
                display: flex;
            }

            .sublink {
                font-family: v.$openExtra;
                padding: 6rem 18rem 6rem 20rem;
                color: v.$green;
                font-size: 14rem;
                display: block;

                @include m.max(sm) {
                    padding: 6px 0;
                }

                &:hover,
                &.router-link-active {
                    color: v.$dark-green;
                }
            }
        }

        .link {
            padding-bottom: 18rem;
            padding-right: 18rem;
            padding-top: 21rem;
            font-size: 18rem;
            color: v.$green;
            display: flex;

            @include m.max(sm) {
                padding: 15px 0;
                display: block;
                width: 50%;
            }

            &.router-link-active {
                &::before {
                    background: v.$green;
                }
            }

            .txt {
                display: block;
            }

            &:after {
                font-size: 10px;
                right: -4rem;
                top: 33%;

                @include m.max(sm) {
                    content: '';

                    background: rgba(255, 255, 255, .5);
                    display: block;
                    margin: 5px;
                    height: 1px;
                    top: -7px;
                    right: 0;
                    left: 0;
                }
            }

            &:nth-child(2)::after,
            &:first-child::after {
                @include m.max(sm) {
                    display: none;
                }
            }
        }

        .item .link {
            @include m.max(sm) {
                width: 100%;
            }
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

    &::after {
        content: '•';

        position: absolute;
    }

    &:hover {
        color: v.$dark-green;

        &::before {
            background: v.$dark-green;
        }
    }

    &:last-child {
        padding-right: 0;

        &::after {
            display: none;
        }

        @include m.max(sm) {
            padding-right: 20px;
        }
    }

    .icon-external {
        margin-left: 4rem;
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
    top: -4px;
    right: 0;

    @include m.max(sm) {
        display: flex;
    }

    span {
        background: #bd9187;
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
