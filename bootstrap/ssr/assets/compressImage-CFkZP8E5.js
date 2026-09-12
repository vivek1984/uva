function formatBytes(bytes) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
async function compressImage(file, maxBytes = 1 * 1024 * 1024) {
  if (file.size <= maxBytes) return { file, compressed: false };
  return new Promise((resolve) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      const MAX_DIM = 1920;
      if (w > MAX_DIM || h > MAX_DIM) {
        const r = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.floor(w * r);
        h = Math.floor(h * r);
      }
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const attempt = (quality, dimScale) => {
        const cw = Math.floor(w * dimScale);
        const ch = Math.floor(h * dimScale);
        canvas.width = cw;
        canvas.height = ch;
        ctx.drawImage(img, 0, 0, cw, ch);
        canvas.toBlob((blob) => {
          if (blob.size <= maxBytes || quality <= 0.2 && dimScale <= 0.25) {
            resolve({
              file: new File(
                [blob],
                file.name.replace(/\.[^.]+$/, ".jpg"),
                { type: "image/jpeg", lastModified: Date.now() }
              ),
              compressed: true,
              originalSize: file.size,
              finalSize: blob.size
            });
          } else if (quality > 0.3) {
            attempt(quality - 0.15, dimScale);
          } else {
            attempt(0.7, dimScale * 0.75);
          }
        }, "image/jpeg", quality);
      };
      attempt(0.85, 1);
    };
    img.src = objUrl;
  });
}
async function compressImages(files, maxBytes = 1 * 1024 * 1024) {
  return Promise.all(files.map((f) => compressImage(f, maxBytes)));
}
export {
  compressImages as a,
  compressImage as c,
  formatBytes as f
};
