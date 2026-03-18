
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
            <h1 class="title-lp">Como funciona o ensaio</h1>
        </div>

        <div class="list">
            <div v-for="item in props.data" :key="item.title" class="item">
                <div class="loop-index">
                    <span>
                        {{ props.data.indexOf(item) + 1 }}
                    </span>
                </div>

                <div class="wrap-icon">
                    <Icon
                        :name="`icons:${item.icon}`"
                        class="icon"/>
                </div>

                <div class="wrap">
                    <h2 class="subtitle">{{ item.title }}</h2>
                </div>
            </div>
        </div>
    </div>
    </section>
</template>

<style scoped lang="scss">
.lp-corporativo {
    background: v.$lp-corporativo;
    padding-top: 45rem;
    margin-top: 45rem;
    color: white;
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
        border: 4rem solid v.$lp-corporativo;
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
            color: v.$lp-corporativo;
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
        background: #eaeaea;
        border-radius: 14rem;
        display: flex;

        @include m.max(sm) {
            width: calc(50% - 20rem);
        }

        .wrap-icon {
            border-bottom-left-radius: 14rem;
            border-top-left-radius: 14rem;
            justify-content: center;
            background: #283C57;
            align-items: center;
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
            color: #283C57;
            padding: 20rem 40rem;
            display: flex;
            align-items: center;

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
        }
    }
}
</style>