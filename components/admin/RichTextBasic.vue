<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [string] }>();

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit.configure({
      heading: false,
      codeBlock: false,
      blockquote: false,
      horizontalRule: false,
    }),
    Underline,
    Link.configure({ openOnClick: false, autolink: false }),
  ],
  editorProps: { attributes: { class: 'rtb-content' } },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    emit('update:modelValue', html === '<p></p>' ? '' : html);
  },
});

/* Sincroniza quando o valor muda por fora (ex: ao carregar). */
watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val || '', { emitUpdate: false });
  }
});

function toggleLink() {
  if (!editor.value) return;
  if (editor.value.isActive('link')) {
    editor.value.chain().focus().unsetLink().run();
    return;
  }
  const url = window.prompt('URL do link (ex: https://... ou /rota)');
  if (url && url.trim()) {
    editor.value.chain().focus().setLink({ href: url.trim() }).run();
  }
}

onBeforeUnmount(() => editor.value?.destroy());
</script>

<template>
  <div class="rtb">
    <div class="rtb-toolbar">
      <button type="button" :class="{ active: editor?.isActive('bold') }" title="Negrito" @click="editor?.chain().focus().toggleBold().run()"><b>B</b></button>
      <button type="button" :class="{ active: editor?.isActive('italic') }" title="Itálico" @click="editor?.chain().focus().toggleItalic().run()"><i>I</i></button>
      <button type="button" :class="{ active: editor?.isActive('underline') }" title="Sublinhado" @click="editor?.chain().focus().toggleUnderline().run()"><u>U</u></button>
      <span class="rtb-sep" />
      <button type="button" :class="{ active: editor?.isActive('link') }" title="Link" @click="toggleLink">🔗</button>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
.rtb {
  margin-top: 4px;
  border: 1px solid t.$border-strong;
  border-radius: 6px;
  overflow: hidden;
  background: t.$bg;
}

.rtb-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  background: t.$surface;
  border-bottom: 1px solid t.$border;

  button {
    background: none;
    border: 1px solid transparent;
    color: t.$text-2;
    width: 28px;
    height: 26px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    &:hover { background: t.$surface-2; color: t.$text; }
    &.active { background: t.$accent; color: t.$accent-ink; }
  }

  .rtb-sep { width: 1px; height: 18px; background: t.$border-strong; margin: 0 4px; }
}

:deep(.rtb-content) {
  min-height: 80px;
  padding: 10px 12px;
  color: t.$text;
  font-size: 14px;
  line-height: 1.5;
  outline: none;

  p { margin: 0 0 6px; &:last-child { margin-bottom: 0; } }
  a { color: t.$accent; text-decoration: underline; }
}
</style>
