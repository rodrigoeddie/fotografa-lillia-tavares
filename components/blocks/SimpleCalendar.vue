<script lang="ts" setup>
const props = defineProps<{ modelValue: string; compact?: boolean }>()
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
  <div class="cal" :class="{ compact }">
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
  --cal-accent: var(--color-highlight, #{v.$green});

  width: 100%;
  max-width: 360rem;
  margin: 0 auto;
  background: white;
  border: 2px solid var(--cal-accent);
  border-radius: 8px;
  overflow: hidden;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--cal-accent);
    padding: 14rem 16rem;

    .title {
      color: white;
      font-size: 22rem;
      font-weight: 600;
      text-transform: capitalize;
      display: flex;
      gap: 0.25em;
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
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4rem;
    padding: 12rem;

    .dow {
      text-align: center;
      font-size: 16rem;
      font-weight: 700;
      color: var(--cal-accent);
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
        background: color-mix(in srgb, var(--cal-accent) 15%, transparent);
      }

      &.empty    { pointer-events: none; }
      &.past     { color: #ccc; cursor: default; }
      &.selected {
        background: var(--cal-accent);
        color: white;
        font-weight: 700;
      }
    }
  }

  /* Modo expandido (Form.vue / agendamento): calendário horizontal no desktop */
  &:not(.compact) {
    @include m.min(md) {
      display: flex;
      max-width: 560rem;

      .header {
        flex-direction: row;
        padding: 24rem 0;
        min-width: 140rem;
        gap: 15rem;

        .title {
          flex-direction: column-reverse;
          align-items: center;
          text-align: center;
          gap: 15rem;

          .month { font-size: 25rem; }

          .year {
            font-size: 20rem;
            opacity: 0.8;
            font-weight: 400;
          }
        }

        .nav {
          padding: 20rem;
          font-size: 60rem;
        }
      }

      .grid {
        padding: 8rem 16rem 4rem;
        flex: 1;
      }
    }
  }

  /* Modo compacto (Tinyform / .cal-expanded do modelo P4): vertical, sem borda espessa */
  &.compact {
    max-width: 310rem;
    border: none;
    box-shadow: 0 2rem 12rem rgba(44, 42, 21, 0.08);

    .header {
      padding: 12rem 16rem;

      .title {
        flex-direction: row;
        align-items: baseline;
        gap: 0.35em;
        font-size: 18rem;

        .month { font-size: 18rem; }

        .year {
          font-size: 16rem;
          font-weight: 400;
          opacity: 0.85;
        }
      }

      .nav { font-size: 26rem; }
    }

    .grid {
      gap: 2rem;
      padding: 10rem 10rem 8rem;

      .dow {
        font-size: 12rem;
        padding-bottom: 4rem;
      }

      .day { font-size: 14rem; }
    }
  }
}
</style>
