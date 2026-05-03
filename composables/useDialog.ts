// Styled dialog helpers using SweetAlert2 — client-side only
// Dynamic import avoids SSR/Cloudflare Workers issues

type AlertIcon = 'success' | 'error' | 'warning' | 'info';

export function useDialog() {
  async function getSwal() {
    const { default: Swal } = await import('sweetalert2');
    return Swal.mixin({
      confirmButtonColor: '#5e2012',
      cancelButtonColor: '#9ca3af',
      buttonsStyling: true,
      customClass: {
        popup: 'swal-lillia',
      },
    });
  }

  async function showAlert(message: string, icon: AlertIcon = 'info', title?: string) {
    const swal = await getSwal();
    return swal.fire({
      icon,
      title: title,
      text: message,
      confirmButtonText: 'Ok',
    });
  }

  async function showConfirm(message: string, title = 'Confirmar', confirmText = 'Confirmar', cancelText = 'Cancelar') {
    const swal = await getSwal();
    const result = await swal.fire({
      icon: 'question',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    });
    return result.isConfirmed;
  }

  return { showAlert, showConfirm };
}
