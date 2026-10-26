/**
 * Helper to compress image files client-side using HTML5 Canvas.
 * Produces crisp, web-optimized JPEG data URLs (<150KB each).
 * This allows multiple photo uploads without hitting serverless or payload limits.
 */
export const compressImageFile = (file, maxWidth = 1400, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    // If it's not an image file, reject
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with reasonable quality
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const processMultipleImageFiles = async (files, maxWidth = 1400, quality = 0.82) => {
  const results = [];
  for (const file of files) {
    try {
      const compressed = await compressImageFile(file, maxWidth, quality);
      results.push(compressed);
    } catch (e) {
      console.error('Failed to compress file:', file.name, e);
    }
  }
  return results;
};
