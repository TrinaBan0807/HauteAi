
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageSelectorProps {
  imageUrl: string;
  onAreaSelected: (area: { x: number; y: number; width: number; height: number }) => void;
}

export const ImageSelector = ({ imageUrl, onAreaSelected }: ImageSelectorProps) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
        height
      };
      setSelectedArea(area);
    }
    
    setIsSelecting(false);
  };

  const confirmSelection = () => {
    if (selectedArea) {
      onAreaSelected(selectedArea);
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
      height: Math.abs(currentPos.y - startPos.y)
    };

    return {
      left: area.x,
      top: area.y,
      width: area.width,
      height: area.height,
    };
  };

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
                <p className="text-sm opacity-80">Draw a box around the clothing or accessory you want to find</p>
              </div>
            </div>
          )}
        </div>

        {selectedArea && (
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
