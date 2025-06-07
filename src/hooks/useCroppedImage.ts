
import { useState, useEffect } from 'react';

export const useCroppedImage = (selectedImage: string | null, selectedArea: any) => {
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImage && selectedArea) {
      console.log('Creating enhanced cropped image preview...', { selectedArea });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        console.log('Image loaded for enhanced cropping', { 
          naturalWidth: img.naturalWidth, 
          naturalHeight: img.naturalHeight,
          selectedArea 
        });

        // Calculate display dimensions more accurately
        const maxDisplayWidth = 400; // Typical image container width
        const maxDisplayHeight = 300; // Typical image container height
        
        const imageAspectRatio = img.naturalWidth / img.naturalHeight;
        const containerAspectRatio = maxDisplayWidth / maxDisplayHeight;
        
        let displayWidth, displayHeight;
        
        if (imageAspectRatio > containerAspectRatio) {
          // Image is wider than container - fit by width
          displayWidth = Math.min(maxDisplayWidth, img.naturalWidth);
          displayHeight = displayWidth / imageAspectRatio;
        } else {
          // Image is taller than container - fit by height
          displayHeight = Math.min(maxDisplayHeight, img.naturalHeight);
          displayWidth = displayHeight * imageAspectRatio;
        }
        
        // Calculate scale factors from display to natural image size
        const scaleX = img.naturalWidth / displayWidth;
        const scaleY = img.naturalHeight / displayHeight;
        
        console.log('Enhanced scale calculation:', { 
          scaleX, 
          scaleY, 
          displayWidth, 
          displayHeight,
          imageAspectRatio,
          containerAspectRatio
        });
        
        // Calculate actual coordinates in the original image
        const actualX = Math.max(0, selectedArea.x * scaleX);
        const actualY = Math.max(0, selectedArea.y * scaleY);
        const actualWidth = Math.min(selectedArea.width * scaleX, img.naturalWidth - actualX);
        const actualHeight = Math.min(selectedArea.height * scaleY, img.naturalHeight - actualY);
        
        console.log('Enhanced crop area:', { actualX, actualY, actualWidth, actualHeight });
        
        // Set canvas size for better preview quality
        const previewSize = 150;
        canvas.width = previewSize;
        canvas.height = previewSize;
        
        if (ctx && actualWidth > 0 && actualHeight > 0) {
          // Clear canvas
          ctx.clearRect(0, 0, previewSize, previewSize);
          
          // Draw the cropped portion with better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          ctx.drawImage(
            img,
            actualX, actualY, actualWidth, actualHeight,
            0, 0, previewSize, previewSize
          );
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCroppedImageUrl(dataUrl);
          console.log('Enhanced cropped image created successfully');
        } else {
          console.warn('Invalid crop dimensions, using fallback');
          setCroppedImageUrl(null);
        }
      };
      
      img.onerror = () => {
        console.error('Failed to load image for cropping');
        setCroppedImageUrl(null);
      };
      
      img.crossOrigin = 'anonymous';
      img.src = selectedImage;
    } else {
      setCroppedImageUrl(null);
    }
  }, [selectedImage, selectedArea]);

  return croppedImageUrl;
};
