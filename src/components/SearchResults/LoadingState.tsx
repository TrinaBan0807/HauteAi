
import { Card } from '@/components/ui/card';

interface LoadingStateProps {
  searchQuery: string;
}

export const LoadingState = ({ searchQuery }: LoadingStateProps) => {
  return (
    <Card className="p-12 bg-white border-gray-100">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
        <h3 className="text-xl font-light text-black tracking-wide">Searching luxury collections...</h3>
        <p className="text-gray-600 font-light">Curating your perfect matches from premier retailers</p>
        <div className="text-sm text-gray-500 font-light tracking-wide">
          {searchQuery}
        </div>
      </div>
    </Card>
  );
};
