/**
 * Redimensiona imagens no cliente (canvas) antes do upload.
 *
 * Portfolio/blog/depoimentos sobem para o Cloudflare Images, que rejeita
 * arquivos acima de ~10 MB (erro 5413). Como os maiores presets do portfólio
 * têm 1700px de largura, não faz sentido enviar originais de câmera (24MP+).
 * Reduzimos o lado maior para `maxDimension` e reencodamos em JPEG de alta
 * qualidade, garantindo o envio abaixo do limite sem perda visível.
 *
 * Só roda no cliente. Formatos que o canvas achataria (GIF animado) e imagens
 * já pequenas o bastante são devolvidas intactas.
 */
export interface ResizeOptions {
  /** Maior lado permitido, em px. */
  maxDimension?: number;
  /** Qualidade do JPEG de saída (0–1). */
  quality?: number;
  /** Se o original já estiver abaixo disto E dentro de maxDimension, não reprocessa. */
  skipUnderBytes?: number;
}

export function useImageResize() {
  async function resizeImage(file: File, opts: ResizeOptions = {}): Promise<File> {
    const {
      maxDimension = 2400,
      quality = 0.85,
      skipUnderBytes = 4 * 1024 * 1024,
    } = opts;

    if (!import.meta.client) return file;
    if (!file.type.startsWith('image/')) return file;
    /* GIF pode ser animado — canvas achataria; SVG não é raster. */
    if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      const longest = Math.max(img.naturalWidth, img.naturalHeight);

      /* Já é pequena o bastante: preserva o arquivo original sem recomprimir. */
      if (longest <= maxDimension && file.size <= skipUnderBytes) return file;

      const ratio = Math.min(maxDimension / longest, 1);
      const w = Math.round(img.naturalWidth * ratio);
      const h = Math.round(img.naturalHeight * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return file;
      ctx.drawImage(img, 0, 0, w, h);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', quality),
      );
      if (!blob) return file;

      const baseName = file.name.replace(/\.[^.]+$/, '');
      return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
    } catch {
      /* Falha ao decodificar: deixa o upload seguir com o original. */
      return file;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  return { resizeImage };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Falha ao decodificar a imagem'));
    img.src = url;
  });
}
