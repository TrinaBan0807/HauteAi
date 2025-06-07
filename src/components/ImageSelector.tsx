import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageSelectorProps {
  imageUrl: string;
  onAreaSelected: (area: { x: number; y: number; width: number; height: number; containerWidth: number; containerHeight: number }) => void;
}

export const ImageSelector = ({ imageUrl, onAreaSelected }: ImageSelectorProps) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsSelecting(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPos({ x, y });
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;

    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    if (width > 20 && height > 20) {
      const area = {
        x: Math.min(startPos.x, currentPos.x),
        y: Math.min(startPos.y, currentPos.y),
        width,
        height,
      };
      setSelectedArea(area);
    }

    setIsSelecting(false);
  };

  const confirmSelection = () => {
    if (selectedArea && containerRef.current) {
      onAreaSelected({
        ...selectedArea,
        containerWidth: containerRef.current.clientWidth,
        containerHeight: containerRef.current.clientHeight,
      });
    }
  };

  const clearSelection = () => {
    setSelectedArea(null);
  };

  const getSelectionStyle = () => {
    if (!isSelecting && !selectedArea) return {};

    const area = selectedArea || {
      x: Math.min(startPos.x, currentPos.x),
      y: Math.min(startPos.y, currentPos.y),
      width: Math.abs(currentPos.x - startPos.x),
      height: Math.abs(currentPos.y - startPos.y),
    };

    return {
      left: area.x,
      top: area.y,
      width: area.width,
      height: area.height,
    };
  };

  // Draw preview when selectedArea or imageUrl changes
  useEffect(() => {
    if (!selectedArea || !imageRef.current || !previewCanvasRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get natural and displayed image sizes
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Calculate the rendered image size and offset inside the container (object-contain logic)
    const imageAspect = naturalWidth / naturalHeight;
    const containerAspect = containerWidth / containerHeight;
    let renderedWidth, renderedHeight, offsetX, offsetY;
    if (imageAspect > containerAspect) {
      // Image is wider than container
      renderedWidth = containerWidth;
      renderedHeight = containerWidth / imageAspect;
      offsetX = 0;
      offsetY = (containerHeight - renderedHeight) / 2;
    } else {
      // Image is taller than container
      renderedHeight = containerHeight;
      renderedWidth = containerHeight * imageAspect;
      offsetX = (containerWidth - renderedWidth) / 2;
      offsetY = 0;
    }

    // Adjust selection coordinates to be relative to the image
    const relX = selectedArea.x - offsetX;
    const relY = selectedArea.y - offsetY;

    // If selection is outside the image, don't draw
    if (relX < 0 || relY < 0 || relX + selectedArea.width > renderedWidth || relY + selectedArea.height > renderedHeight) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Calculate scale factors
    const scaleX = naturalWidth / renderedWidth;
    const scaleY = naturalHeight / renderedHeight;

    // Convert selection to natural image coordinates
    const actualX = Math.max(0, relX * scaleX);
    const actualY = Math.max(0, relY * scaleY);
    const actualWidth = Math.min(selectedArea.width * scaleX, naturalWidth - actualX);
    const actualHeight = Math.min(selectedArea.height * scaleY, naturalHeight - actualY);

    // Set canvas size for preview (scale it if needed)
    const previewWidth = 150;
    const previewHeight = actualHeight > 0 ? (actualHeight / actualWidth) * previewWidth : previewWidth;
    canvas.width = previewWidth;
    canvas.height = previewHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the cropped portion of the image onto the canvas
    if (actualWidth > 0 && actualHeight > 0) {
      ctx.drawImage(
        img,
        actualX,
        actualY,
        actualWidth,
        actualHeight,
        0,
        0,
        previewWidth,
        previewHeight
      );
    }
  }, [selectedArea, imageUrl]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div
          ref={containerRef}
          className="relative cursor-crosshair border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Captured"
            className="w-full h-auto max-h-96 object-contain"
            draggable={false}
          />

          {/* Selection overlay */}
          {(isSelecting || selectedArea) && (
            <div
              className="absolute border-2 border-purple-500 bg-purple-500/20"
              style={getSelectionStyle()}
            />
          )}

          {/* Instruction overlay */}
          {!selectedArea && !isSelecting && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <p className="text-lg font-semibold mb-2">Click and drag to select an item</p>
                <p className="text-sm opacity-80">
                  Draw a box around the clothing or accessory you want to find
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedArea && (
          <div className="flex flex-col items-center space-y-4">
            <div>
              <canvas
                ref={previewCanvasRef}
                className="border border-gray-300 rounded-md"
                style={{ maxWidth: '150px', maxHeight: '150px' }}
              />
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={confirmSelection}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Use This Selection
              </Button>
              <Button
                onClick={clearSelection}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        {!selectedArea && (
          <div className="text-center text-gray-600 text-sm">
            Click and drag on the image to select the fashion item you want to search for
          </div>
        )}
      </div>
    </Card>
  );
};
