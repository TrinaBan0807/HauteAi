
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetrySearch: () => void;
}

export const ErrorState = ({ error, onRetrySearch }: ErrorStateProps) => {
  return (
    <Card className="p-12 bg-white border-gray-100">
      <div className="text-center space-y-6">
        <Search className="w-16 h-16 text-gray-300 mx-auto" />
        <h3 className="text-xl font-light text-black tracking-wide">Search Unavailable</h3>
        <p className="text-gray-600 font-light mb-6">{error}</p>
        <Button
          onClick={onRetrySearch}
          variant="outline"
          className="border-black text-black hover:bg-black hover:text-white font-light text-xs tracking-wider uppercase"
        >
          <RefreshCw className="w-3 h-3 mr-2" />
          Try Again
        </Button>
      </div>
    </Card>
  );
};
