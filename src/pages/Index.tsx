
import { useState } from 'react';
import { Camera, Upload, Search, Sparkles } from 'lucide-react';
import { ImageCapture } from '@/components/ImageCapture';
import { ImageSelector } from '@/components/ImageSelector';
import { SearchResults } from '@/components/SearchResults';
import { OutfitDescriptor } from '@/components/OutfitDescriptor';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'capture' | 'select' | 'describe' | 'search'>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [outfitDescription, setOutfitDescription] = useState<string>('');

  const handleImageCaptured = (imageUrl: string) => {
    setCapturedImage(imageUrl);
    setCurrentStep('select');
  };

  const handleAreaSelected = (area: any) => {
    setSelectedArea(area);
    setCurrentStep('describe');
  };

  const handleDescriptionComplete = (description: string) => {
    setOutfitDescription(description);
    setCurrentStep('search');
  };

  const resetApp = () => {
    setCurrentStep('capture');
    setCapturedImage(null);
    setSelectedArea(null);
    setOutfitDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Fashion Finder
              </h1>
            </div>
            {currentStep !== 'capture' && (
              <Button
                onClick={resetApp}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Start Over
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['capture', 'select', 'describe', 'search'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  currentStep === step 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : index < ['capture', 'select', 'describe', 'search'].indexOf(currentStep)
                    ? 'bg-purple-200 text-purple-600'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < ['capture', 'select', 'describe', 'search'].indexOf(currentStep)
                      ? 'bg-purple-300'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-600 capitalize font-medium">
              {currentStep === 'capture' && 'Take or Upload Photo'}
              {currentStep === 'select' && 'Select Item in Photo'}
              {currentStep === 'describe' && 'Describe the Item'}
              {currentStep === 'search' && 'Search Results'}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'capture' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Find Fashion Items from Photos
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Take a photo or upload an image, select the item you want to find, 
                  and we'll help you search for similar fashion pieces online.
                </p>
              </div>
              <ImageCapture onImageCaptured={handleImageCaptured} />
            </div>
          )}

          {currentStep === 'select' && capturedImage && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Select the Item You Want to Find
                </h2>
                <p className="text-gray-600">
                  Draw a box around the clothing or accessory you want to search for
                </p>
              </div>
              <ImageSelector 
                imageUrl={capturedImage} 
                onAreaSelected={handleAreaSelected}
              />
            </div>
          )}

          {currentStep === 'describe' && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Describe the Item
                </h2>
                <p className="text-gray-600">
                  Add details to improve search accuracy
                </p>
              </div>
              <OutfitDescriptor 
                selectedImage={capturedImage}
                selectedArea={selectedArea}
                onDescriptionComplete={handleDescriptionComplete}
              />
            </div>
          )}

          {currentStep === 'search' && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  Similar items found online
                </p>
              </div>
              <SearchResults 
                selectedImage={capturedImage}
                selectedArea={selectedArea}
                description={outfitDescription}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
