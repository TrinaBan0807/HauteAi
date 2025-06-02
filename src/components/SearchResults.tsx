
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Heart } from 'lucide-react';

interface SearchResultsProps {
  selectedImage: string | null;
  selectedArea: any;
  description: string;
}

interface SearchResult {
  id: string;
  title: string;
  price: string;
  store: string;
  imageUrl: string;
  link: string;
  similarity: number;
}

export const SearchResults = ({ selectedImage, selectedArea, description }: SearchResultsProps) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Mock search results - in a real app, this would call an actual search API
  useEffect(() => {
    const mockSearch = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Cotton Basic T-Shirt',
          price: '$24.99',
          store: 'Fashion Store',
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
          link: '#',
          similarity: 95
        },
        {
          id: '2',
          title: 'Premium Cotton Tee',
          price: '$35.00',
          store: 'Style Hub',
          imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f37f4eb6?w=300&h=300&fit=crop',
          link: '#',
          similarity: 88
        },
        {
          id: '3',
          title: 'Organic Cotton T-Shirt',
          price: '$28.50',
          store: 'Eco Fashion',
          imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=300&h=300&fit=crop',
          link: '#',
          similarity: 82
        },
        {
          id: '4',
          title: 'Classic Fit Tee',
          price: '$19.99',
          store: 'Budget Style',
          imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop',
          link: '#',
          similarity: 78
        },
        {
          id: '5',
          title: 'Designer Cotton Top',
          price: '$65.00',
          store: 'Luxury Brands',
          imageUrl: 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=300&h=300&fit=crop',
          link: '#',
          similarity: 75
        },
        {
          id: '6',
          title: 'Casual Cotton Shirt',
          price: '$32.00',
          store: 'Everyday Wear',
          imageUrl: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=300&h=300&fit=crop',
          link: '#',
          similarity: 70
        }
      ];
      
      setResults(mockResults);
      setIsLoading(false);
    };

    mockSearch();
  }, [description]);

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto"></div>
          <h3 className="text-lg font-semibold text-gray-800">Searching for similar items...</h3>
          <p className="text-gray-600">Looking through millions of fashion items to find the best matches</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <div className="flex items-start space-x-4">
          {selectedImage && selectedArea && (
            <div className="flex-shrink-0">
              <div 
                className="w-16 h-16 border-2 border-purple-200 rounded-lg overflow-hidden bg-gray-100"
                style={{
                  backgroundImage: `url(${selectedImage})`,
                  backgroundPosition: `-${selectedArea.x * 0.25}px -${selectedArea.y * 0.25}px`,
                  backgroundSize: '25%',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">Search Query</h3>
            <p className="text-sm text-gray-600">{description}</p>
            <Badge variant="secondary" className="mt-2">
              {results.length} items found
            </Badge>
          </div>
        </div>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative">
              <img
                src={result.imageUrl}
                alt={result.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => toggleFavorite(result.id)}
                className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
              >
                <Heart 
                  className={`w-4 h-4 ${
                    favorites.has(result.id) 
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
        ))}
      </div>

      {/* No Results */}
      {results.length === 0 && !isLoading && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <Search className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-800">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your description or selecting a different part of the image
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
