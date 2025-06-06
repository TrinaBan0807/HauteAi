
import { useState, useEffect } from 'react';

export const useCroppedImage = (selectedImage: string | null, selectedArea: any) => {
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImage && selectedArea) {
      console.log('Creating cropped image preview...', { selectedArea });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        console.log('Image loaded for cropping', { 
          naturalWidth: img.naturalWidth, 
          naturalHeight: img.naturalHeight,
          selectedArea 
        });

        // Calculate scale factors
        const displayMaxWidth = 600; // Approximate container width
        const displayMaxHeight = 384; // max-h-96 in pixels
        
        let displayWidth, displayHeight;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        
        if (aspectRatio > displayMaxWidth / displayMaxHeight) {
          // Image is wider - constrain by width
          displayWidth = Math.min(displayMaxWidth, img.naturalWidth);
          displayHeight = displayWidth / aspectRatio;
        } else {
          // Image is taller - constrain by height
          displayHeight = Math.min(displayMaxHeight, img.naturalHeight);
          displayWidth = displayHeight * aspectRatio;
        }
        
        const scaleX = img.naturalWidth / displayWidth;
        const scaleY = img.naturalHeight / displayHeight;
        
        console.log('Scale factors:', { scaleX, scaleY, displayWidth, displayHeight });
        
        // Calculate actual coordinates in the original image
        const actualX = selectedArea.x * scaleX;
        const actualY = selectedArea.y * scaleY;
        const actualWidth = selectedArea.width * scaleX;
        const actualHeight = selectedArea.height * scaleY;
        
        console.log('Actual crop area:', { actualX, actualY, actualWidth, actualHeight });
        
        // Set canvas size to a reasonable preview size
        const previewSize = 128;
        canvas.width = previewSize;
        canvas.height = previewSize;
        
        if (ctx) {
          // Draw the cropped portion of the image scaled to fit the preview
          ctx.drawImage(
            img,
            actualX, actualY, actualWidth, actualHeight,
            0, 0, previewSize, previewSize
          );
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setCroppedImageUrl(dataUrl);
          console.log('Cropped image created successfully');
        }
      };
      
      img.crossOrigin = 'anonymous';
      img.src = selectedImage;
    } else {
      setCroppedImageUrl(null);
    }
  }, [selectedImage, selectedArea]);

  return croppedImageUrl;
};
