import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onRetrySearch: () => void;
}

export const EmptyState = ({ onRetrySearch }: EmptyStateProps) => {
  return (
    <Card className="p-8 border-gray-100">
      <div className="text-center space-y-4">
        <Search className="w-16 h-16 text-gray-300 mx-auto" />
        <h3 className="text-lg font-semibold text-black">No results found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your description or selecting a different part of the image
        </p>
        <Button
          onClick={onRetrySearch}
          variant="outline"
          className="border-gray-200 text-black hover:bg-gray-50 hover:border-yellow-400"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Different Search
        </Button>
      </div>
    </Card>
  );
};