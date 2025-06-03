
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

interface SearchSummaryCardProps {
  selectedImage: string | null;
  selectedArea: any;
  description: string;
  searchQuery: string;
  resultsCount: number;
  onRetrySearch: () => void;
}

export const SearchSummaryCard = ({ 
  selectedImage, 
  selectedArea, 
  description, 
  searchQuery, 
  resultsCount, 
  onRetrySearch 
}: SearchSummaryCardProps) => {
  const renderCroppedImage = () => {
    if (!selectedImage || !selectedArea) return null;

    return (
      <div className="flex-shrink-0">
        <div className="w-24 h-24 border-2 border-purple-200 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url(${selectedImage})`,
              backgroundPosition: `-${selectedArea.x * (96 / selectedArea.width)}px -${selectedArea.y * (96 / selectedArea.height)}px`,
              backgroundSize: `${selectedArea.width * (96 / selectedArea.width)}px ${selectedArea.height * (96 / selectedArea.height)}px`,
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">Reference Item</p>
      </div>
    );
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
      <div className="flex items-start space-x-4">
        {renderCroppedImage()}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">Search Result</h3>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          {searchQuery && (
            <p className="text-xs text-purple-600 font-medium mb-2">
              Search Query: {searchQuery}
            </p>
          )}
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
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
