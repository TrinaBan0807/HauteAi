
import { useState } from 'react';
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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-500 group border border-gray-100 bg-white">
      <div className="relative">
        <img
          src={result.imageUrl}
          alt={result.title}
          className="w-full h-64 object-cover group-hover:scale-[1.02] transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop&q=80`;
          }}
        />
        <button
          onClick={() => onToggleFavorite(result.id)}
          className="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-sm hover:bg-white transition-colors duration-200 shadow-sm"
        >
          <Heart 
            className={`w-4 h-4 ${
              isFavorite 
                ? 'text-black fill-current' 
                : 'text-gray-400'
            }`} 
          />
        </button>
        <Badge 
          className="absolute top-4 left-4 bg-black text-white font-light text-xs tracking-wide"
        >
          {result.similarity}% MATCH
        </Badge>
      </div>
      <div className="p-6 space-y-4">
        <h3 className="font-light text-gray-900 line-clamp-2 text-sm tracking-wide leading-relaxed">{result.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-light text-black tracking-wide">{result.price}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-light">{result.store}</span>
        </div>
        <Button
          variant="outline"
          className="w-full border border-black text-black hover:bg-black hover:text-white font-light rounded-none transition-all duration-300 tracking-wide uppercase text-xs py-2"
          onClick={() => window.open(result.link, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Item
        </Button>
      </div>
    </Card>
  );
};
