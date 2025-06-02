
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Heart, RefreshCw } from 'lucide-react';

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

  const performImageSearch = async (imageData: string, area: any, desc: string) => {
    console.log('Starting image-based search...');
    console.log('Image data:', imageData ? 'Image provided' : 'No image');
    console.log('Selected area:', area);
    console.log('Description:', desc);

    setIsLoading(true);
    
    try {
      // Simulate processing the uploaded image and selected area
      const processedQuery = generateSearchQuery(imageData, area, desc);
      setSearchQuery(processedQuery);
      
      // Simulate API delay for image processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate results based on the processed image and description
      const searchResults = await generateSearchResults(processedQuery);
      setResults(searchResults);
      
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSearchQuery = (imageData: string, area: any, desc: string) => {
    // Extract key terms from description
    const descriptionTerms = desc.toLowerCase().split(/[,\s]+/).filter(term => 
      term.length > 2 && !['the', 'and', 'for', 'with'].includes(term)
    );
    
    // Simulate image analysis results
    const imageAnalysis = {
      dominantColors: ['blue', 'white', 'black'],
      detectedItems: ['shirt', 'clothing', 'apparel'],
      style: ['casual', 'modern']
    };
    
    // Combine description terms with simulated image analysis
    const combinedTerms = [...new Set([...descriptionTerms, ...imageAnalysis.detectedItems])];
    return combinedTerms.join(' ');
  };

  const generateSearchResults = async (query: string): Promise<SearchResult[]> => {
    // Simulate different result sets based on query content
    const baseResults = [
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
      }
    ];

    // Customize results based on query terms
    if (query.includes('dress')) {
      return [
        {
          id: '4',
          title: 'Summer Floral Dress',
          price: '$45.99',
          store: 'Dress Boutique',
          imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop',
          link: '#',
          similarity: 92
        },
        {
          id: '5',
          title: 'Casual Midi Dress',
          price: '$38.50',
          store: 'Fashion Forward',
          imageUrl: 'https://images.unsplash.com/photo-1566479179817-c0ae1ff3e0c0?w=300&h=300&fit=crop',
          link: '#',
          similarity: 87
        },
        ...baseResults.slice(0, 2)
      ];
    }

    if (query.includes('shoes') || query.includes('sneakers')) {
      return [
        {
          id: '6',
          title: 'Classic White Sneakers',
          price: '$79.99',
          store: 'Shoe Palace',
          imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
          link: '#',
          similarity: 94
        },
        {
          id: '7',
          title: 'Running Sports Shoes',
          price: '$120.00',
          store: 'Athletic Gear',
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
          link: '#',
          similarity: 89
        },
        ...baseResults.slice(0, 2)
      ];
    }

    return baseResults.concat([
      {
        id: '8',
        title: 'Designer Cotton Top',
        price: '$65.00',
        store: 'Luxury Brands',
        imageUrl: 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=300&h=300&fit=crop',
        link: '#',
        similarity: 75
      },
      {
        id: '9',
        title: 'Casual Cotton Shirt',
        price: '$32.00',
        store: 'Everyday Wear',
        imageUrl: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=300&h=300&fit=crop',
        link: '#',
        similarity: 70
      }
    ]);
  };

  const retrySearch = () => {
    if (selectedImage && description) {
      performImageSearch(selectedImage, selectedArea, description);
    }
  };

  useEffect(() => {
    if (selectedImage || description) {
      performImageSearch(selectedImage || '', selectedArea, description);
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

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto"></div>
          <h3 className="text-lg font-semibold text-gray-800">Analyzing your image...</h3>
          <p className="text-gray-600">Processing image data and finding similar fashion items</p>
          <div className="text-sm text-purple-600 font-medium">
            Search Query: {searchQuery || 'Generating...'}
          </div>
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
            <h3 className="font-semibold text-gray-800 mb-1">Search Analysis</h3>
            <p className="text-sm text-gray-600 mb-2">{description}</p>
            {searchQuery && (
              <p className="text-xs text-purple-600 font-medium mb-2">
                Processed Query: {searchQuery}
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
                Retry
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
      {results.length === 0 && !isLoading && (
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
              Try Again
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
