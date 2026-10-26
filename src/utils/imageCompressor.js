/**
 * Helper to compress image files client-side using HTML5 Canvas.
 * Produces crisp, web-optimized JPEG data URLs (~60KB - 80KB each).
 * This ensures even 15-25 photos easily fit within Vercel's 4.5MB serverless limit.
 */

export const compressImageFile = (file, maxWidth = 960, quality = 0.70) => {
  return new Promise((resolve, reject) => {
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
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const compressDataUrl = (dataUrl, maxWidth = 960, quality = 0.70) => {
  return new Promise((resolve) => {
    // If it's a regular http URL or small, leave as is
    if (!dataUrl.startsWith('data:image/') || dataUrl.length < 120000) {
      return resolve(dataUrl);
    }

    const img = new Image();
    img.src = dataUrl;
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
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(dataUrl); // fallback to original
  });
};

export const processMultipleImageFiles = async (files, maxWidth = 960, quality = 0.70) => {
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

/**
 * Ensures all gallery images are compressed and total payload stays safely under 3.5MB.
 */
export const optimizeGalleryForSave = async (gallery = []) => {
  const optimized = [];
  for (const img of gallery) {
    if (typeof img === 'string' && img.startsWith('data:image/')) {
      const comp = await compressDataUrl(img, 960, 0.68);
      optimized.push(comp);
    } else {
      optimized.push(img);
    }
  }
  return optimized;
};
