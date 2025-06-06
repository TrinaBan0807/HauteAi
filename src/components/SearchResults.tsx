
import { useState } from 'react';
import { SearchSummaryCard } from './SearchResults/SearchSummaryCard';
import { SearchResultCard } from './SearchResults/SearchResultCard';
import { LoadingState } from './SearchResults/LoadingState';
import { ErrorState } from './SearchResults/ErrorState';
import { EmptyState } from './SearchResults/EmptyState';
import { useCroppedImage } from '@/hooks/useCroppedImage';
import { useSearchResults } from '@/hooks/useSearchResults';

interface SearchResultsProps {
  selectedImage: string | null;
  selectedArea: any;
  description: string;
}

export const SearchResults = ({ selectedImage, selectedArea, description }: SearchResultsProps) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const croppedImageUrl = useCroppedImage(selectedImage, selectedArea);
  const { results, isLoading, searchQuery, error, retrySearch } = useSearchResults(selectedImage, selectedArea, description);

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
    return <ErrorState error={error} onRetrySearch={retrySearch} />;
  }

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <SearchSummaryCard
        croppedImageUrl={croppedImageUrl}
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
        <EmptyState onRetrySearch={retrySearch} />
      )}
    </div>
  );
};
