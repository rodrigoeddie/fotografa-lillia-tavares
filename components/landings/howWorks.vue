
<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>

<template>
    <section class="section-lp" data-ani-type="fade-up">
        <div class="container">
            <div class="ac">
                <h1 class="title-lp">{{ props.data.title }}</h1>
            </div>

            <div class="list">
                <div v-for="item in props.data.list" :key="item.title" class="item">
                    <div class="loop-index">
                        <span>
                            {{ props.data.list.indexOf(item) + 1 }}
                        </span>
                    </div>

                    <div class="wrap-icon">
                        <Icon
                            :name="`icons:${item.icon}`"
                            class="icon"
                            :fill="item.fillnone ? 'none' : 'currentColor'"
                            :class="{ 'fill-none': item.fillnone }" />
                    </div>

                    <div class="wrap">
                        <h2 class="subtitle">{{ item.title }}</h2>
                        <p class="description-item">{{ item.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.section-lp {
    background: v.$green;
    padding-top: 45rem;
    margin-top: 45rem;
    color: white;

    .list {
        .loop-index {
            border: 4rem solid v.$green;
            
            span {
                color: v.$green;
            }
        }

        .item {
            .wrap-icon {
                background-color: #a79f7b;

                .fill-none {
                    fill: none !important;
                    color: transparent
                }
            }

            .wrap {
                color: v.$green;
            }
        }
    }
}

.title-lp {
    padding-top: 0;
    margin-top: 0;
}

.list {
    justify-content: center;
    padding: 30rem 30rem 0;
    padding-top: 40rem;
    flex-wrap: wrap;
    display: flex;
    gap: 20rem;

    @include m.max(sm) {
        padding: 50rem 10rem 30rem;
        gap: 60rem 13rem;
    }

    .loop-index {
        justify-content: center;
        position: absolute;
        background: white;
        display: flex;
        border-radius: 50%;
        width: 60rem;
        aspect-ratio: 1;
        align-items: center;
        color: white;
        font-weight: bold;
        left: 35rem;
        top: -50rem;
        z-index: 2;

        @include m.max(sm) {
            width: 40rem;
            left: 21rem;
            top: -32rem;
        }
        
        span {
            font-size: 33rem;
            line-height: 1em;
            font-weight: bold;

            @include m.max(sm) {
                font-size: 23rem;
            }
        }
    }

    .item {
        width: calc(25% - 20rem);
        background: white;
        border-radius: 14rem;
        display: flex;
        border: 1px solid white;

        @include m.max(sm) {
            width: calc(50% - 20rem);
        }

        .wrap-icon {
            border-bottom-left-radius: 14rem;
            border-top-left-radius: 14rem;
            justify-content: center;
            color: white;
            align-items: center;
            border-right: 1px solid white;
            aspect-ratio: 1;
            display: flex;
            width: 35%;

            svg {
                fill: white;
                height: 100%;
                width: 65%;
            }
        }

        .wrap {
            padding: 20rem;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;

            @include m.max(sm) {
                padding: 20rem;
            }
            
            .subtitle {
                font-size: 30rem;
                line-height: 1em;

                @include m.max(sm) {
                    font-size: 20rem;
                }
            }

            .description-item {
                font-size: 17rem;
                padding-top: 5rem;
            }
        }
    }
}

.lp-corporativo {
    background: v.$lp-corporativo;

    .list {
        .loop-index {
            border: 4rem solid v.$lp-corporativo;
            
            span {
                color: v.$lp-corporativo;
            }
        }

        .item {
            .wrap-icon {
                background: v.$lp-corporativo-light;
            }

            .wrap {
                color: v.$lp-corporativo-light;
            }
        }
    }
}

.lp-dia-das-maes {
    background: white;
    padding-bottom: 0;
    padding-top: 0;

    .container {
        background: v.$lp-dia-das-maes-light;
        padding-bottom: 45rem;
        padding-top: 45rem;
    }

    .list {
        .loop-index {
            border: 4rem solid v.$lp-dia-das-maes-light;
            
            span {
                color: v.$lp-dia-das-maes-light;
            }
        }

        .item {
            @include m.max(sm) {
                height: 256rem;
                // height: auto;
            }

            .wrap-icon {
                background: v.$lp-dia-das-maes;
            }

            .wrap {
                color: v.$lp-dia-das-maes;
            }
        }
    }
}

.coloracao-steps {
    .list .item {
        height: 190rem;

        @include m.max(sm) {
            height: 250rem;
        }
    }
}
</style>