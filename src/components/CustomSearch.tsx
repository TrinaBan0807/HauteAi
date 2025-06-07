import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Sparkles } from 'lucide-react';
import { SearchService } from '@/services/SearchService';

interface CustomSearchProps {
  onSearchComplete: (searchQuery: string) => void;
}

export const CustomSearch = ({ onSearchComplete }: CustomSearchProps) => {
  const [itemType, setItemType] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [style, setStyle] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [size, setSize] = useState('');
  const [material, setMaterial] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      // Build comprehensive search query from user inputs
      const searchTerms = [
        itemType,
        color,
        brand,
        style,
        priceRange && `under ${priceRange}`,
        size && `size ${size}`,
        material,
        additionalDetails
      ].filter(Boolean);

      const searchQuery = searchTerms.join(', ') || 'fashion item';
      
      console.log('Custom search initiated with dynamic query:', searchQuery);
      console.log('Search parameters:', {
        itemType, color, brand, style, priceRange, size, material, additionalDetails
      });

      // Use the dynamic search service
      await SearchService.searchByQuery(searchQuery);
      
      // Pass the query to the parent component
      onSearchComplete(searchQuery);
      
    } catch (error) {
      console.error('Custom search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const quickItems = [
    'T-shirt', 'Dress', 'Jeans', 'Jacket', 'Shoes', 'Bag', 'Watch', 'Sunglasses',
    'Sneakers', 'Boots', 'Sweater', 'Skirt', 'Shorts', 'Blazer'
  ];

  const quickColors = [
    'Black', 'White', 'Blue', 'Red', 'Pink', 'Green', 'Gray', 'Brown', 
    'Navy', 'Beige'
  ];

  const quickStyles = [
    'Casual', 'Formal', 'Vintage', 'Modern', 'Bohemian', 'Minimalist', 
    'Streetwear', 'Classic', 'Sporty', 'Elegant'
  ];

  const quickBrands = [
    'Saint Laurent','Balenciaga','Chloé'
  ];

  return (
    <Card className="p-6 max-w-3xl mx-auto glass-luxury border border-gray-200/30">
      <div className="text-center mb-6">
        <div className="w-16 h-16 gradient-bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dynamic Fashion Search</h2>
        <p className="text-gray-600">Describe what you're looking for and we'll search dynamically</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Item Type */}
          <div className="space-y-2">
            <Label htmlFor="itemType" className="text-sm font-medium">What are you looking for?</Label>
            <Input
              id="itemType"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              placeholder="e.g., T-shirt, Dress, Shoes..."
              className="border-gray-300 focus:border-black"
              disabled={isSearching}
            />
            <div className="flex flex-wrap gap-1">
              {quickItems.slice(0, 8).map((item) => (
                <Button
                  key={item}
                  variant="outline"
                  size="sm"
                  onClick={() => setItemType(item)}
                  disabled={isSearching}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 text-xs h-7"
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
              className="border-gray-300 focus:border-black"
              disabled={isSearching}
            />
            <div className="flex flex-wrap gap-1">
              {quickColors.slice(0, 8).map((colorOption) => (
                <Button
                  key={colorOption}
                  variant="outline"
                  size="sm"
                  onClick={() => setColor(colorOption)}
                  disabled={isSearching}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 text-xs h-7"
                >
                  {colorOption}
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
              placeholder="e.g., Dolce&Gabbana,Saint Laurent , ..."
              className="border-gray-300 focus:border-black"
              disabled={isSearching}
            />
            <div className="flex flex-wrap gap-1">
              {quickBrands.slice(0, 6).map((brandOption) => (
                <Button
                  key={brandOption}
                  variant="outline"
                  size="sm"
                  onClick={() => setBrand(brandOption)}
                  disabled={isSearching}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 text-xs h-7"
                >
                  {brandOption}
                </Button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <Label htmlFor="style" className="text-sm font-medium">Style</Label>
            <Input
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g., Casual, Formal, Vintage..."
              className="border-gray-300 focus:border-black"
              disabled={isSearching}
            />
            <div className="flex flex-wrap gap-1">
              {quickStyles.slice(0, 6).map((styleOption) => (
                <Button
                  key={styleOption}
                  variant="outline"
                  size="sm"
                  onClick={() => setStyle(styleOption)}
                  disabled={isSearching}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 text-xs h-7"
                >
                  {styleOption}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Price Range */}
          <div className="space-y-2">
            <Label htmlFor="priceRange" className="text-sm font-medium">Price Range (optional)</Label>
            <Input
              id="priceRange"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              placeholder="e.g., $50, $100..."
              className="border-gray-300 focus:border-black"
              disabled={isSearching}
            />
            <div className="flex flex-wrap gap-1">
              {['$25', '$50', '$100', '$200'].map((price) => (
                <Button
                  key={price}
                  variant="outline"
                  size="sm"
                  onClick={() => setPriceRange(price)}
                  disabled={isSearching}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 text-xs h-7"
                >
                  Under {price}
                </Button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label htmlFor="size" className="text-sm font-medium">Size (optional)</Label>
            <Input
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g., M, L, XL, 8, 10..."
              className="border-gray-300 focus:border-black"
              disabled={isSearching}
            />
            <div className="flex flex-wrap gap-1">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sizeOption) => (
                <Button
                  key={sizeOption}
                  variant="outline"
                  size="sm"
                  onClick={() => setSize(sizeOption)}
                  disabled={isSearching}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 text-xs h-7"
                >
                  {sizeOption}
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
              className="border-gray-300 focus:border-black"
              disabled={isSearching}
            />
            <div className="flex flex-wrap gap-1">
              {['Cotton', 'Denim', 'Leather', 'Silk', 'Wool'].map((materialOption) => (
                <Button
                  key={materialOption}
                  variant="outline"
                  size="sm"
                  onClick={() => setMaterial(materialOption)}
                  disabled={isSearching}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 text-xs h-7"
                >
                  {materialOption}
                </Button>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label htmlFor="details" className="text-sm font-medium">Additional Details</Label>
            <Textarea
              id="details"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Any other details like patterns, occasion, fit..."
              className="border-gray-300 focus:border-black"
              disabled={isSearching}
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <Button
          onClick={handleSearch}
          disabled={(!itemType && !additionalDetails) || isSearching}
          className="w-full btn-elegant py-3 disabled:opacity-50"
        >
          {isSearching ? (
            <>
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
              Searching Dynamically...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Search Fashion Items
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};