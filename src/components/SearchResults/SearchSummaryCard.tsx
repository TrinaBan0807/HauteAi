
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, Zap } from 'lucide-react';

interface SearchSummaryCardProps {
  croppedImageUrl: string | null;
  selectedImage: string | null;
  selectedArea: any;
  description: string;
  searchQuery: string;
  resultsCount: number;
  onRetrySearch: () => void;
}

export const SearchSummaryCard = ({ 
  croppedImageUrl, 
  selectedImage, 
  selectedArea, 
  description, 
  searchQuery, 
  resultsCount, 
  onRetrySearch 
}: SearchSummaryCardProps) => {
  const renderReferenceItem = () => {
    // Show the cropped image from the selected area with better preview
    if (croppedImageUrl && selectedImage && selectedArea) {
      return (
        <div className="flex-shrink-0">
          <div className="w-24 h-24 border-2 border-purple-200 rounded-lg overflow-hidden bg-gray-100 shadow-md">
            <img 
              src={croppedImageUrl}
              alt="Selected item from your photo"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&q=80`;
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">Selected Item</p>
        </div>
      );
    }
    
    // For text search - show search icon
    if (!selectedImage && description) {
      return (
        <div className="flex-shrink-0">
          <div className="w-24 h-24 border-2 border-purple-200 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 shadow-md flex items-center justify-center">
            <Search className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">Text Search</p>
        </div>
      );
    }
    
    return null;
  };

  const getSearchTypeIndicator = () => {
    if (searchQuery.includes('Filtering results to show only:')) {
      const itemType = searchQuery.split('only: ')[1]?.split(' ')[0] || '';
      return (
        <div className="flex items-center space-x-1 mb-2">
          <Zap className="w-3 h-3 text-green-500" />
          <span className="text-xs text-green-600 font-medium">
            Filtered to show only: {itemType}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
      <div className="flex items-start space-x-4">
        {renderReferenceItem()}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">Search Results</h3>
          {getSearchTypeIndicator()}
          <p className="text-sm text-gray-600 mb-2">{description || 'Image-based search'}</p>
          {searchQuery && (
            <p className="text-xs text-purple-600 font-medium mb-2">
              Query: {searchQuery}
            </p>
          )}
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {resultsCount} items found
            </Badge>
            <Button
              onClick={onRetrySearch}
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              New Search
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
