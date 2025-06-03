
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Heart, RefreshCw } from 'lucide-react';
import { SearchService } from '@/services/SearchService';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const performDynamicSearch = async (imageData: string | null, area: any, desc: string) => {
    console.log('Starting dynamic search...');
    console.log('Image data:', imageData ? 'Image provided' : 'No image');
    console.log('Selected area:', area);
    console.log('Description:', desc);

    setIsLoading(true);
    setError(null);
    setSearchQuery('Processing...');
    
    try {
      let searchResults: SearchResult[] = [];

      if (imageData && desc) {
        // Combined image and text search
        setSearchQuery('Analyzing image and description...');
        searchResults = await SearchService.searchByImageAndDescription(imageData, area, desc);
        setSearchQuery(`Image + Text: "${desc}"`);
      } else if (imageData) {
        // Image-only search
        setSearchQuery('Analyzing image...');
        const imageAnalysis = await SearchService.analyzeImage(imageData, area);
        const analysisQuery = [...imageAnalysis.detectedItems, ...imageAnalysis.dominantColors].join(' ');
        searchResults = await SearchService.searchByQuery(analysisQuery);
        setSearchQuery(`Image Analysis: ${analysisQuery}`);
      } else if (desc) {
        // Text-only search
        setSearchQuery(`Text Search: "${desc}"`);
        searchResults = await SearchService.searchByQuery(desc);
      }

      setResults(searchResults);
      
    } catch (error) {
      console.error('Dynamic search failed:', error);
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const retrySearch = () => {
    if (selectedImage || description) {
      performDynamicSearch(selectedImage, selectedArea, description);
    }
  };

  useEffect(() => {
    if (selectedImage || description) {
      performDynamicSearch(selectedImage, selectedArea, description);
    }
  }, [selectedImage, selectedArea, description]);

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

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

  if (isLoading) {
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
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <Search className="w-16 h-16 text-red-300 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-800">Search Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={retrySearch}
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Summary */}
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
                {results.length} items found
              </Badge>
              <Button
                onClick={retrySearch}
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

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
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
      )}

      {/* No Results */}
      {results.length === 0 && !isLoading && !error && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <Search className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-800">No results found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your description or selecting a different part of the image
            </p>
            <Button
              onClick={retrySearch}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Different Search
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
