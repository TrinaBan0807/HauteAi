
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Heart } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  price: string;
  store: string;
  imageUrl: string;
  link: string;
  similarity: number;
}

interface SearchResultCardProps {
  result: SearchResult;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const SearchResultCard = ({ result, isFavorite, onToggleFavorite }: SearchResultCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img
          src={result.imageUrl}
          alt={result.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop`;
          }}
        />
        <button
          onClick={() => onToggleFavorite(result.id)}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
        >
          <Heart 
            className={`w-4 h-4 ${
              isFavorite 
                ? 'text-red-500 fill-current' 
                : 'text-gray-400'
            }`} 
          />
        </button>
        <Badge 
          className="absolute top-2 left-2 bg-purple-500 text-white"
        >
          {result.similarity}% match
        </Badge>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-800 line-clamp-2">{result.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">{result.price}</span>
          <span className="text-sm text-gray-500">{result.store}</span>
        </div>
        <Button
          variant="outline"
          className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
          onClick={() => window.open(result.link, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Item
        </Button>
      </div>
    </Card>
  );
};
