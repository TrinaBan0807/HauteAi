import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import { useCroppedImage } from '@/hooks/useCroppedImage';

interface OutfitDescriptorProps {
  selectedImage: string | null;
  selectedArea: any;
  onDescriptionComplete: (description: string) => void;
}

export const OutfitDescriptor = ({ selectedImage, selectedArea, onDescriptionComplete }: OutfitDescriptorProps) => {
  const [itemType, setItemType] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [style, setStyle] = useState('');
  const [brand, setBrand] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [containerSize, setContainerSize] = useState({ width: 150, height: 150 });
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      setContainerSize({
        width: previewRef.current.offsetWidth,
        height: previewRef.current.offsetHeight,
      });
    }
  }, [selectedImage, selectedArea]);

  const croppedImageUrl = useCroppedImage(
    selectedImage,
    selectedArea,
    selectedArea?.containerWidth,
    selectedArea?.containerHeight
  );

  const handleSubmit = () => {
    const description = [
      itemType && `Type: ${itemType}`,
      color && `Color: ${color}`,
      material && `Material: ${material}`,
      style && `Style: ${style}`,
      brand && `Brand: ${brand}`,
      additionalDetails && `Details: ${additionalDetails}`
    ].filter(Boolean).join(', ');

    onDescriptionComplete(description || 'Fashion item');
  };

  const quickItems = [
    'T-shirt', 'Dress', 'Jeans', 'Jacket', 'Shoes', 'Bag', 'Watch', 'Sunglasses'
  ];

  const quickColors = [
    'Black', 'White', 'Blue', 'Red', 'Pink', 'Green', 'Yellow', 'Purple', 'Brown', 'Gray'
  ];

  const quickStyles = [
    'Casual', 'Formal', 'Vintage', 'Modern', 'Bohemian', 'Minimalist', 'Streetwear', 'Classic'
  ];

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Preview of selected area */}
        {selectedImage && selectedArea && (
          <div className="text-center">
            <div ref={previewRef} className="inline-block border-2 border-purple-200 rounded-lg overflow-hidden bg-gray-100" style={{ width: 150, height: 150 }}>
              {croppedImageUrl ? (
                <img
                  src={croppedImageUrl}
                  alt="Selected item preview"
                  className="w-full h-full object-cover"
                  style={{ display: 'block' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Preview</div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">Selected item</p>
          </div>
        )}

        {/* Item Type */}
        <div className="space-y-2">
          <Label htmlFor="itemType" className="text-sm font-medium">What type of item is this?</Label>
          <Input
            id="itemType"
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            placeholder="e.g., T-shirt, Dress, Shoes..."
            className="border-purple-200 focus:border-purple-400"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {quickItems.map((item) => (
              <Button
                key={item}
                variant="outline"
                size="sm"
                onClick={() => setItemType(item)}
                className="border-purple-200 text-purple-600 hover:bg-purple-50 text-xs"
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label htmlFor="color" className="text-sm font-medium">Color</Label>
          <Input
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g., Navy blue, Bright red..."
            className="border-purple-200 focus:border-purple-400"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {quickColors.map((colorOption) => (
              <Button
                key={colorOption}
                variant="outline"
                size="sm"
                onClick={() => setColor(colorOption)}
                className="border-purple-200 text-purple-600 hover:bg-purple-50 text-xs"
              >
                {colorOption}
              </Button>
            ))}
          </div>
        </div>

        {/* Material */}
        <div className="space-y-2">
          <Label htmlFor="material" className="text-sm font-medium">Material (optional)</Label>
          <Input
            id="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="e.g., Cotton, Denim, Leather..."
            className="border-purple-200 focus:border-purple-400"
          />
        </div>

        {/* Style */}
        <div className="space-y-2">
          <Label htmlFor="style" className="text-sm font-medium">Style</Label>
          <Input
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="e.g., Casual, Formal, Vintage..."
            className="border-purple-200 focus:border-purple-400"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {quickStyles.map((styleOption) => (
              <Button
                key={styleOption}
                variant="outline"
                size="sm"
                onClick={() => setStyle(styleOption)}
                className="border-purple-200 text-purple-600 hover:bg-purple-50 text-xs"
              >
                {styleOption}
              </Button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-sm font-medium">Brand (optional)</Label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g.,Chloé,Balenciaga..."
            className="border-purple-200 focus:border-purple-400"
          />
        </div>

        {/* Additional Details */}
        <div className="space-y-2">
          <Label htmlFor="details" className="text-sm font-medium">Additional Details (optional)</Label>
          <Textarea
            id="details"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="Any other details that might help find similar items..."
            className="border-purple-200 focus:border-purple-400"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Search for Similar Items
        </Button>
      </div>
    </Card>
  );
};
