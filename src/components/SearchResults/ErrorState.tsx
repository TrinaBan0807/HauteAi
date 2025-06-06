
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetrySearch: () => void;
}

export const ErrorState = ({ error, onRetrySearch }: ErrorStateProps) => {
  return (
    <Card className="p-8">
      <div className="text-center space-y-4">
        <Search className="w-16 h-16 text-red-300 mx-auto" />
        <h3 className="text-lg font-semibold text-gray-800">Search Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button
          onClick={onRetrySearch}
          variant="outline"
          className="border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </Card>
  );
};
