
<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>

<template>
    <section class="container section-lp" data-ani-type="fade-up">
        <div class="ac">
            <h1 class="title">Para quem é esse ensaio</h1>
        </div>

        <div class="for-who__list">
            <div v-for="item in props.data" :key="item.title" class="for-who__group">
                <h2 class="for-who__group-title">{{ item.title }}</h2>
                <ul class="for-who__items">
                    <li v-for="entry in item.list" :key="entry" class="for-who__item">{{ entry }}</li>
                </ul>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.section-lp {
    padding-top: 45rem;

    @include m.max(sm) {
        padding-bottom: 0;
    }
}

.for-who__list {
    justify-content: center;
    padding-top: 40rem;
    flex-wrap: wrap;
    display: flex;
    gap: 20rem;
    
    @include m.max(sm) {
        padding-top: 15rem;
        gap: 13rem;
    }

    .for-who__group-title {
        padding-bottom: 5rem;
        font-weight: bold;
        font-size: 22rem;

        @include m.max(sm) {
            font-size: 18rem;
        }
    }

    .for-who__group {
        @include m.max(sm) {
            width: calc(33% - 13rem);
        }
    }
    
    .for-who__items {
        border-radius: 8rem;
        background: #eaeaea;
        padding: 20rem 40rem;
        width: 380rem;
        height: 83%;
        
        @include m.max(sm) {
            // background: transparent;
            width: 100%;
            padding: 10rem;
        }
        
        .for-who__item {
            font-size: 22rem;
            font-weight: 300;
            line-height: 1.5em;
            list-style: disc;
        
            @include m.max(sm) {
                font-size: 16rem;
                list-style: none;

                &::before {
                    content: "•";

                    color: v.$lp-corporativo;
                    display: inline-block;
                    width: 10rem;
                }
            }
        }
    }
}

.lp-corporativo {
    .for-who__list {
        color: v.$lp-corporativo;
    }
}
</style>