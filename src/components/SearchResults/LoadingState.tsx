
import { Card } from '@/components/ui/card';

interface LoadingStateProps {
  searchQuery: string;
}

export const LoadingState = ({ searchQuery }: LoadingStateProps) => {
  return (
    <Card className="p-8">
      <div className="text-center space-y-4">
        <div className="animate-spin w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto"></div>
        <h3 className="text-lg font-semibold text-gray-800">Searching fashion items...</h3>
        <p className="text-gray-600">Processing your request and finding similar items</p>
        <div className="text-sm text-purple-600 font-medium">
          Status: {searchQuery}
        </div>
      </div>
    </Card>
  );
};
