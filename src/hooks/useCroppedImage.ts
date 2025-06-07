import { useState, useEffect } from 'react';

export const useCroppedImage = (selectedImage: string | null, selectedArea: any, containerWidth?: number, containerHeight?: number) => {
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImage && selectedArea && containerWidth && containerHeight) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        // Calculate rendered image size and offset (object-contain logic)
        const imageAspect = naturalWidth / naturalHeight;
        const containerAspect = containerWidth / containerHeight;
        let renderedWidth, renderedHeight, offsetX, offsetY;
        if (imageAspect > containerAspect) {
          renderedWidth = containerWidth;
          renderedHeight = containerWidth / imageAspect;
          offsetX = 0;
          offsetY = (containerHeight - renderedHeight) / 2;
        } else {
          renderedHeight = containerHeight;
          renderedWidth = containerHeight * imageAspect;
          offsetX = (containerWidth - renderedWidth) / 2;
          offsetY = 0;
        }
        // Adjust selection coordinates to be relative to the image
        const relX = selectedArea.x - offsetX;
        const relY = selectedArea.y - offsetY;
        // Calculate scale factors
        const scaleX = naturalWidth / renderedWidth;
        const scaleY = naturalHeight / renderedHeight;
        // Convert selection to natural image coordinates
        const actualX = Math.max(0, relX * scaleX);
        const actualY = Math.max(0, relY * scaleY);
        const actualWidth = Math.min(selectedArea.width * scaleX, naturalWidth - actualX);
        const actualHeight = Math.min(selectedArea.height * scaleY, naturalHeight - actualY);
        // Set canvas size for preview
        const previewWidth = 150;
        const previewHeight = actualHeight > 0 ? (actualHeight / actualWidth) * previewWidth : previewWidth;
        canvas.width = previewWidth;
        canvas.height = previewHeight;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        if (ctx && actualWidth > 0 && actualHeight > 0) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(
            img,
            actualX, actualY, actualWidth, actualHeight,
            0, 0, previewWidth, previewHeight
          );
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCroppedImageUrl(dataUrl);
        } else {
          setCroppedImageUrl(null);
        }
      };
      img.onerror = () => setCroppedImageUrl(null);
      img.crossOrigin = 'anonymous';
      img.src = selectedImage;
    } else {
      setCroppedImageUrl(null);
    }
  }, [selectedImage, selectedArea, containerWidth, containerHeight]);
  return croppedImageUrl;
};
