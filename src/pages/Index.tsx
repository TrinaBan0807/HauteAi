
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
    <div className="min-h-screen saks-gradient-bg relative overflow-hidden">
      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-100/30 to-gray-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-black/5 to-gray-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 saks-dark-gradient rounded-sm flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-light saks-text-gradient tracking-wide">
                  LUXE FINDER
                </h1>
                <p className="text-xs text-gray-500 font-light tracking-widest uppercase">Discover Luxury Fashion</p>
              </div>
            </div>
            {(currentStep !== 'capture' && currentStep !== 'custom-search') && (
              <Button
                onClick={resetApp}
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white font-light text-xs tracking-wider uppercase transition-all duration-300"
              >
                <Camera className="w-3 h-3 mr-2" />
                New Search
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section - only show on capture step */}
        {currentStep === 'capture' && (
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-6xl font-light text-black mb-8 leading-tight tracking-wide">
              Discover Your
              <span className="block saks-text-gradient font-normal">
                Perfect Match
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
              Upload any fashion image and discover similar luxury pieces from the world's finest retailers. 
              Experience precision in fashion discovery.
            </p>
            
            {/* Search Mode Toggle */}
            <div className="flex justify-center mb-12">
              <div className="bg-white border border-gray-200 rounded-sm p-1 shadow-sm">
                <div className="flex space-x-1">
                  <Button
                    onClick={switchToImageSearch}
                    variant={searchMode === 'image' ? 'default' : 'ghost'}
                    className={`px-8 py-3 rounded-sm transition-all duration-300 font-light text-xs tracking-wider uppercase ${
                      searchMode === 'image'
                        ? 'saks-dark-gradient text-white'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <Camera className="w-3 h-3 mr-2" />
                    Image Search
                  </Button>
                  <Button
                    onClick={switchToCustomSearch}
                    variant={searchMode === 'text' ? 'default' : 'ghost'}
                    className={`px-8 py-3 rounded-sm transition-all duration-300 font-light text-xs tracking-wider uppercase ${
                      searchMode === 'text'
                        ? 'saks-dark-gradient text-white'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <Type className="w-3 h-3 mr-2" />
                    Text Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Search Hero */}
        {currentStep === 'custom-search' && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-sm mb-8">
              <Type className="w-3 h-3 text-black" />
              <span className="text-xs font-light text-black tracking-wider uppercase">Text Search</span>
            </div>
            <h2 className="text-5xl font-light text-black mb-6 leading-tight tracking-wide">
              Describe Your
              <span className="block saks-text-gradient font-normal">
                Ideal Piece
              </span>
            </h2>
            <div className="flex justify-center mb-8">
              <Button
                onClick={switchToImageSearch}
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white font-light text-xs tracking-wider uppercase"
              >
                <Camera className="w-3 h-3 mr-2" />
                Switch to Image
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Progress Indicator */}
        {(currentStep !== 'capture' && currentStep !== 'custom-search') && (
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-6 left-0 right-0 h-px bg-gray-200">
                  <div 
                    className="h-full saks-dark-gradient transition-all duration-700 ease-out"
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
                      <div className={`w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? 'saks-dark-gradient text-white scale-110'
                          : isCompleted
                          ? 'bg-gray-200 text-black scale-105'
                          : 'bg-white text-gray-400 border border-gray-200'
                      }`}>
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <div className="mt-4 text-center">
                        <p className={`text-xs font-light tracking-wider uppercase ${
                          isActive ? 'text-black' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 max-w-20 font-light">
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
              <div className="mt-20 grid md:grid-cols-3 gap-8">
                <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-100 bg-white">
                  <div className="w-12 h-12 saks-dark-gradient rounded-sm flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-light text-black mb-3 tracking-wide">Precision Recognition</h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">Advanced AI identifies luxury items with exceptional accuracy</p>
                </Card>
                
                <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-100 bg-white">
                  <div className="w-12 h-12 saks-dark-gradient rounded-sm flex items-center justify-center mx-auto mb-6">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-light text-black mb-3 tracking-wide">Curated Discovery</h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">Find similar pieces from premier luxury retailers worldwide</p>
                </Card>
                
                <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-100 bg-white">
                  <div className="w-12 h-12 saks-dark-gradient rounded-sm flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-light text-black mb-3 tracking-wide">Style Intelligence</h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">Discover pieces that elevate your personal aesthetic</p>
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
              <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-black mb-4 tracking-wide">
                  Select Your Item
                </h2>
                <p className="text-gray-600 text-lg font-light">
                  Draw a selection around the fashion piece you wish to discover
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
              <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-black mb-4 tracking-wide">
                  Describe Your Item
                </h2>
                <p className="text-gray-600 text-lg font-light">
                  Provide additional details to refine your search and discover the perfect match
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
              <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-black mb-4 tracking-wide">
                  Your Curated Matches
                </h2>
                <p className="text-gray-600 text-lg font-light">
                  Discover similar luxury pieces from the world's finest retailers
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
