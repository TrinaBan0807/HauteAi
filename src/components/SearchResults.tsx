
import { useState, useEffect } from 'react';
import { SearchService } from '@/services/SearchService';
import { SearchSummaryCard } from './search/SearchSummaryCard';
import { SearchResultCard } from './search/SearchResultCard';
import { LoadingState } from './search/LoadingState';
import { ErrorState } from './search/ErrorState';
import { NoResultsState } from './search/NoResultsState';

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

  if (isLoading) {
    return <LoadingState searchQuery={searchQuery} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={retrySearch} />;
  }

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <SearchSummaryCard
        selectedImage={selectedImage}
        selectedArea={selectedArea}
        description={description}
        searchQuery={searchQuery}
        resultsCount={results.length}
        onRetrySearch={retrySearch}
      />

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <SearchResultCard
              key={result.id}
              result={result}
              isFavorite={favorites.has(result.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && !isLoading && !error && (
        <NoResultsState onRetry={retrySearch} />
      )}
    </div>
  );
};
