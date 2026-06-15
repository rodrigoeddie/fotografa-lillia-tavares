<script lang="ts" setup>
const props = defineProps<{
  title?: string
  url?: string
  variant?: 'default' | 'dark'
}>();

const currentUrl = computed(() => {
  if (props.url) return props.url;
  if (import.meta.client) return window.location.href;
  return '';
});

const shareText = computed(() => props.title ?? '');

const waHref = computed(() =>
  `https://wa.me/?text=${encodeURIComponent(shareText.value + '\n' + currentUrl.value)}`
);

const fbHref = computed(() =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl.value)}`
);

const copied = ref(false);
async function copyLink() {
  if (!import.meta.client) return;
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    const el = document.createElement('textarea');
    el.value = currentUrl.value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
}
</script>

<template>
  <div class="share-buttons" :class="{ dark: variant === 'dark' }">
    <span class="label">Compartilhar:</span>

    <a
      :href="waHref"
      target="_blank"
      rel="noopener noreferrer"
      class="share-btn wa"
      aria-label="Compartilhar no WhatsApp"
      title="Compartilhar no WhatsApp"
    >
      <Icon name="icons:whatsapp" />
    </a>

    <a
      :href="fbHref"
      target="_blank"
      rel="noopener noreferrer"
      class="share-btn fb"
      aria-label="Compartilhar no Facebook"
      title="Compartilhar no Facebook"
    >
      <Icon name="mdi:facebook" />
    </a>

    <button
      class="share-btn copy"
      :aria-label="copied ? 'Link copiado!' : 'Copiar link'"
      :title="copied ? 'Link copiado!' : 'Copiar link'"
      @click="copyLink"
    >
      <Icon v-if="copied" name="mdi:check" />
      <Icon v-else name="mdi:link-variant" />
      <span v-if="copied" class="copied-label">Copiado!</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.share-buttons {
  display: flex;
  align-items: center;
  gap: 10rem;
  flex-wrap: wrap;

  .label {
    font-size: 14rem;
    color: #888;
    margin-right: 4rem;
  }

  &.dark {
    .label {
      color: rgba(255, 255, 255, 0.7);
    }

    .share-btn.copy {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 5rem;
  width: 40rem;
  height: 40rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 20rem;
  justify-content: center;
  transition: transform 0.2s ease, opacity 0.2s ease;
  text-decoration: none;

  &:hover {
    transform: scale(1.1);
    opacity: 0.85;
  }

  &.wa {
    background: #25D366;
    color: white;
  }

  &.fb {
    background: #1877F2;
    color: white;
  }

  &.copy {
    background: #e9e5d8;
    color: #555;
    position: relative;
  }
}

.copied-label {
  position: absolute;
  top: calc(100% + 6rem);
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  font-size: 11rem;
  padding: 3rem 7rem;
  border-radius: 4rem;
  white-space: nowrap;
  pointer-events: none;
}
</style>
