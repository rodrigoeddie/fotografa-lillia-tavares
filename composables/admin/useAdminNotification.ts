const message = ref('');
const messageType = ref<'success' | 'error'>('success');

export function useAdminNotification() {
  function showMessage(msg: string, type: 'success' | 'error') {
    message.value = msg;
    messageType.value = type;
    setTimeout(() => { message.value = ''; }, 6000);
  }

  return { message, messageType, showMessage };
}
