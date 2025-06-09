import { useState } from 'react';
import { Camera, Upload, Search, Sparkles, Zap, Eye, Target, Type } from 'lucide-react';
import { ImageCapture } from '@/components/ImageCapture';
import { ImageSelector } from '@/components/ImageSelector';
import { SearchResults } from '@/components/SearchResults';
import { OutfitDescriptor } from '@/components/OutfitDescriptor';
import { CustomSearch } from '@/components/CustomSearch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'capture' | 'select' | 'describe' | 'search' | 'custom-search'>('capture');
  const [searchMode, setSearchMode] = useState<'image' | 'text'>('image');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; width: number; height: number; containerWidth: number; containerHeight: number } | null>(null);
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

  const handleCustomSearch = (searchQuery: string) => {
    setOutfitDescription(searchQuery);
    setCurrentStep('search');
  };

  const resetApp = () => {
    setCurrentStep('capture');
    setSearchMode('image');
    setCapturedImage(null);
    setSelectedArea(null);
    setOutfitDescription('');
  };

  const switchToCustomSearch = () => {
    setSearchMode('text');
    setCurrentStep('custom-search');
  };

  const switchToImageSearch = () => {
    setSearchMode('image');
    setCurrentStep('capture');
  };

  const steps = [
    { id: 'capture', title: 'Capture', icon: Camera, description: 'Take or Upload Photo' },
    { id: 'select', title: 'Select', icon: Target, description: 'Select Item in Photo' },
    { id: 'describe', title: 'Describe', icon: Eye, description: 'Describe the Item' },
    { id: 'search', title: 'Search', icon: Search, description: 'Search Results' }
  ];

  const customSteps = [
    { id: 'custom-search', title: 'Describe', icon: Type, description: 'Describe What You Want' },
    { id: 'search', title: 'Search', icon: Search, description: 'Search Results' }
  ];

  const currentSteps = searchMode === 'text' ? customSteps : steps;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Elegant background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-black/5 to-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 saks-gradient rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 saks-gold-gradient rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold saks-text-gradient">
                  HauteAi
                </h1>
                <p className="text-sm text-gray-600 font-medium">Your Personal Stylist with Vision & Vogue</p>
              </div>
            </div>
            {(currentStep !== 'capture' && currentStep !== 'custom-search') && (
              <Button
                onClick={resetApp}
                variant="outline"
                className="border-gray-200 text-black hover:bg-gray-50 hover:border-yellow-400 transition-all duration-300 hover:scale-105"
              >
                <Camera className="w-4 h-4 mr-2" />
                New Search
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section - only show on capture step */}
        {currentStep === 'capture' && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl font-bold text-black mb-6 leading-tight">
              Find Your Perfect
              <span className="saks-text-gradient block">
                Fashion Match
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Upload any fashion photo and let our AI identify and find similar items from online stores. 
              Or describe what you're looking for and discover your style, instantly.
            </p>
            
            {/* Search Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-50 rounded-2xl p-2 border border-gray-100 shadow-lg">
                <div className="flex space-x-2">
                  <Button
                    onClick={switchToImageSearch}
                    variant={searchMode === 'image' ? 'default' : 'ghost'}
                    className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                      searchMode === 'image'
                        ? 'saks-gradient text-white shadow-lg'
                        : 'text-gray-700 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Search by Image
                  </Button>
                  <Button
                    onClick={switchToCustomSearch}
                    variant={searchMode === 'text' ? 'default' : 'ghost'}
                    className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                      searchMode === 'text'
                        ? 'saks-gradient text-white shadow-lg'
                        : 'text-gray-700 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Search by Description
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Search Hero */}
        {currentStep === 'custom-search' && (
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full mb-6">
              <Type className="w-4 h-4 text-black" />
              <span className="text-sm font-semibold text-black">Text-Based Search</span>
            </div>
            <h2 className="text-4xl font-bold text-black mb-4 leading-tight">
              Describe Your
              <span className="saks-text-gradient block">
                Perfect Item
              </span>
            </h2>
            <div className="flex justify-center mb-6">
              <Button
                onClick={switchToImageSearch}
                variant="outline"
                className="border-gray-200 text-black hover:bg-gray-50 hover:border-yellow-400"
              >
                <Camera className="w-4 h-4 mr-2" />
                Switch to Image Search
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Progress Indicator */}
        {(currentStep !== 'capture' && currentStep !== 'custom-search') && (
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                  <div 
                    className="h-full saks-gradient rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(currentSteps.findIndex(s => s.id === currentStep) / (currentSteps.length - 1)) * 100}%`
                    }}
                  />
                </div>
                
                {currentSteps.map((step, index) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = index < currentSteps.findIndex(s => s.id === currentStep);
                  const StepIcon = step.icon;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? 'saks-gradient text-white shadow-lg scale-110'
                          : isCompleted
                          ? 'bg-yellow-100 text-black scale-105'
                          : 'bg-white text-gray-400 border-2 border-gray-200'
                      }`}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div className="mt-3 text-center">
                        <p className={`text-sm font-semibold ${
                          isActive ? 'text-black' : isCompleted ? 'text-black' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 max-w-20">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'capture' && (
            <div className="animate-fade-in">
              <ImageCapture onImageCaptured={handleImageCaptured} />
              
              {/* Features Section */}
              <div className="mt-16 grid md:grid-cols-3 gap-8">
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-100">
                  <div className="w-12 h-12 saks-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">Smart Recognition</h3>
                  <p className="text-gray-600 text-sm">Advanced AI identifies clothing items with 95% accuracy</p>
                </Card>
                
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-100">
                  <div className="w-12 h-12 saks-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">Instant Search</h3>
                  <p className="text-gray-600 text-sm">Find similar items from thousands of online stores</p>
                </Card>
                
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">Style Matching</h3>
                  <p className="text-gray-600 text-sm">Discover items that match your unique style preferences</p>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 'custom-search' && (
            <div className="animate-fade-in">
              <CustomSearch onSearchComplete={handleCustomSearch} />
            </div>
          )}

          {currentStep === 'select' && capturedImage && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-black mb-3">
                  Select Your Item
                </h2>
                <p className="text-gray-700 text-lg">
                  Draw a box around the fashion item you want to find
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
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-black mb-3">
                  Describe Your Item
                </h2>
                <p className="text-gray-700 text-lg">
                  Add details to improve search accuracy and find the perfect match
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
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-black mb-3">
                  Your Fashion Matches
                </h2>
                <p className="text-gray-700 text-lg">
                  Discover similar items from top fashion retailers
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