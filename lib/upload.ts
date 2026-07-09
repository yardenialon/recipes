// ============================================================
// פאזה 3 — עזר להעלאת תמונות (צד לקוח)
// מקטין את התמונה בדפדפן לפני ההעלאה: חוסך אחסון, עומד במגבלת גוף הבקשה,
// ומאיץ את ההעלאה. מחזיר Blob של WebP.
// ============================================================

export const UPLOAD_POINTS = 20;
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // 3MB — אחרי הקטנה זה בשפע

/** מקטין קובץ תמונה לרוחב/גובה מרבי ומחזיר WebP Blob */
export async function resizeImage(
  file: File,
  maxDim = 1600,
  quality = 0.82
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = document.createElement("img");
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("image load failed"));
      img.src = url;
    });

    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas unsupported");
    ctx.drawImage(img, 0, 0, w, h);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("encode failed"))),
        "image/webp",
        quality
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
