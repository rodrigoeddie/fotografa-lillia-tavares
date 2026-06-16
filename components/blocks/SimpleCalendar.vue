<script lang="ts" setup>
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const today = new Date()
today.setHours(0, 0, 0, 0)

const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAYS   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

const days = computed(() => {
  const total    = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay()
  const result: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= total; d++) result.push(d)
  return result
})

const isPast = (day: number) =>
  new Date(viewYear.value, viewMonth.value, day) <= today

const isSelected = (day: number) => {
  if (!props.modelValue) return false
  const [y, m, d] = props.modelValue.split('-').map(Number)
  return y === viewYear.value && m === viewMonth.value + 1 && d === day
}

const select = (day: number | null) => {
  if (!day || isPast(day)) return
  const m = String(viewMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  emit('update:modelValue', `${viewYear.value}-${m}-${d}`)
}

const canGoPrev = computed(() =>
  viewYear.value > today.getFullYear() || viewMonth.value > today.getMonth()
)

const prev = () => {
  if (!canGoPrev.value) return
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}

const next = () => {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}
</script>

<template>
  <div class="cal">
    <div class="header">
      <button type="button" class="nav" :disabled="!canGoPrev" @click="prev">‹</button>
      <span class="title">
        <span class="month">{{ MONTHS[viewMonth] }}</span>
        <span class="year">{{ viewYear }}</span>
      </span>
      <button type="button" class="nav" @click="next">›</button>
    </div>

    <div class="grid">
      <span class="dow" v-for="d in DAYS" :key="d">{{ d }}</span>
      <button
        v-for="(day, i) in days"
        :key="i"
        type="button"
        class="day"
        :class="{
          empty:    !day,
          past:     day && isPast(day),
          selected: day && isSelected(day),
        }"
        :disabled="!day || isPast(day)"
        @click="select(day)"
      >{{ day ?? '' }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cal {
  width: 100%;
  max-width: 360rem;
  margin: 0 auto;
  background: white;
  border: 2px solid v.$green;
  border-radius: 8px;
  overflow: hidden;

  @include m.min(md) {
    display: flex;
    max-width: 560rem;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: v.$green;
    padding: 14rem 16rem;
    
    @include m.min(md) {
      flex-direction: row;
      padding: 24rem 0;
      min-width: 140rem;
      gap: 15rem;
    }

    .title {
      color: white;
      font-size: 22rem;
      font-weight: 600;
      text-transform: capitalize;
      display: flex;
      gap: 0.25em;

      @include m.min(md) {
        flex-direction: column-reverse;
        align-items: center;
        text-align: center;
        gap: 15rem;
      }

      .month {
        @include m.min(md) {
          font-size: 25rem;
        }
      }

      .year {
        @include m.min(md) {
          font-size: 20rem;
          opacity: 0.8;
          font-weight: 400;
        }
      }
    }

    .nav {
      background: none;
      border: none;
      color: white;
      font-size: 34rem;
      line-height: 1;
      cursor: pointer;
      padding: 0 8rem;
      opacity: 0.85;
      transition: opacity 0.2s;

      &:hover:not(:disabled) { opacity: 1; }
      &:disabled { opacity: 0.3; cursor: default; }

      @include m.min(md) {
        padding: 20rem;
        font-size: 60rem;
      }
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4rem;
    padding: 12rem;

    @include m.min(md) {
      padding: 8rem 16rem 4rem;
      flex: 1;
    }

    .dow {
      text-align: center;
      font-size: 16rem;
      font-weight: 700;
      color: v.$green;
      padding-bottom: 6rem;
    }

    .day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18rem;
      border: none;
      border-radius: 50%;
      background: none;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;

      &:hover:not(:disabled):not(.selected) {
        background: color-mix(in srgb, v.$green 15%, transparent);
      }

      &.empty    { pointer-events: none; }
      &.past     { color: #ccc; cursor: default; }
      &.selected {
        background: v.$green;
        color: white;
        font-weight: 700;
      }
    }
  }
}
</style>
