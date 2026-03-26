
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
        <h1 class="title-lp" v-html="props.data.title"></h1>
        <p class="description-lp" v-html="props.data.description"></p>

        <div class="for-who__list">
            <div v-for="item in props.data.lists" :key="item.title" class="for-who__group">
                <h2 class="for-who__group-title" v-html="item.title"></h2>
                <ul class="for-who__items">
                    <li v-for="entry in item.list" :key="entry" class="for-who__item" v-html="entry"></li>
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

.title-lp {
    margin-bottom: 0;
    padding-top: 0;
}

.description-lp {
    padding-bottom: 20rem;
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

            :deep(small) {
                font-size: 20rem;
        
                @include m.max(sm) {
                    font-size: 16rem;
                }
            }
        
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
    color: v.$lp-corporativo;

    .for-who__list {
        color: v.$lp-corporativo;
    }

    .description {
        color: v.$lp-corporativo;
    }
}
.lp-dia-das-maes {
    color: v.$lp-dia-das-maes;
    padding-top: 0;

    .for-who__list .for-who__group {
        @include m.max(sm) {
            width: calc(50% - 13rem);
        }
    }

    .for-who__list {
        color: v.$lp-dia-das-maes;
    }

    .for-who__list ul {
        background-color: v.$lp-dia-das-maes-ultralight;
    }

    .description {
        color: v.$lp-dia-das-maes;
    }
}

.lp-presentes {
    color: v.$lp-presentes;

    .for-who__list {
        color: v.$lp-presentes;
    }

    .for-who__list ul {
        background-color: v.$lp-presentes-ultralight;
    }

    .description {
        color: v.$lp-presentes;
    }
}
</style>