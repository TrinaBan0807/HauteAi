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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Enhanced luxury gradient overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-black/5 via-gray-400/3 to-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-gray-900/8 via-gray-600/4 to-black/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-white/15 via-gray-200/8 to-gray-400/3 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 w-72 h-72 bg-gradient-to-br from-gray-100/20 via-gray-300/10 to-white/15 rounded-full blur-xl"></div>
      </div>

      {/* Enhanced Header with luxury aesthetics */}
      <div className="glass-luxury sticky top-0 z-50 shadow-sm border-b border-gray-200/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-black via-gray-700 to-gray-900 rounded-lg flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-gray-300 to-white rounded-full shadow-sm"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text-luxury tracking-wide">
                  HauteAi
                </h1>
                <p className="text-sm text-gray-500 font-light tracking-[0.2em] uppercase">Your Personal Stylist with Vision & Vogue</p>
              </div>
            </div>
            {(currentStep !== 'capture' && currentStep !== 'custom-search') && (
              <Button
                onClick={resetApp}
                variant="outline"
                className="border-black/20 text-black hover:bg-gradient-to-r hover:from-black hover:to-gray-800 hover:text-white font-light text-xs tracking-wider uppercase transition-all duration-500 shadow-md hover:shadow-lg glass-effect"
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
        {/* Enhanced Hero Section with Script Typography */}
        {currentStep === 'capture' && (
          <div className="text-center mb-20 animate-fade-in">
            <div className="space-y-8">
              {/* Main Script Title */}
              
              
              {/* Elegant Separator */}
              <div className="flex justify-center items-center space-x-4 my-8">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-black to-transparent"></div>
                <div className="w-2 h-2 bg-gradient-to-br from-black to-gray-600 rounded-full"></div>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-black to-transparent"></div>
              </div>
              
              {/* Secondary Title */}
              <h3 className="text-6xl font-elegant gradient-text-luxury leading-tight tracking-wide mb-6">
                Discover Your Perfect Match
              </h3>
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
                Upload any fashion image and discover similar luxury pieces from the world's finest retailers. 
                <span className="block mt-3 font-script text-2xl gradient-text-script">
                  Experience precision in fashion discovery.
                </span>
              </p>
            </div>
            
            {/* Enhanced Search Mode Toggle */}
            <div className="flex justify-center mb-16 mt-16">
              <div className="glass-luxury rounded-xl p-3 shadow-xl">
                <div className="flex space-x-3">
                  <Button
                    onClick={switchToImageSearch}
                    variant={searchMode === 'image' ? 'default' : 'ghost'}
                    className={`px-12 py-5 rounded-lg transition-all duration-700 font-light text-sm tracking-wider uppercase ${
                      searchMode === 'image'
                        ? 'bg-gradient-to-r from-black via-gray-800 to-gray-900 text-white shadow-lg'
                        : 'text-gray-600 hover:text-black hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200'
                    }`}
                  >
                    <Camera className="w-4 h-4 mr-3" />
                    Image Search
                  </Button>
                  <Button
                    onClick={switchToCustomSearch}
                    variant={searchMode === 'text' ? 'default' : 'ghost'}
                    className={`px-12 py-5 rounded-lg transition-all duration-700 font-light text-sm tracking-wider uppercase ${
                      searchMode === 'text'
                        ? 'bg-gradient-to-r from-black via-gray-800 to-gray-900 text-white shadow-lg'
                        : 'text-gray-600 hover:text-black hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200'
                    }`}
                  >
                    <Type className="w-4 h-4 mr-3" />
                    Text Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Custom Search Hero */}
        {currentStep === 'custom-search' && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center space-x-3 glass-luxury px-8 py-4 rounded-xl mb-12 shadow-lg">
              <Type className="w-4 h-4 text-black" />
              <span className="text-sm font-medium text-black tracking-wider uppercase">Text Search</span>
            </div>
            <h2 className="text-7xl font-script gradient-text-script animate-luxury-shimmer leading-tight tracking-wide mb-8 text-shadow-luxury">
              Describe Your Ideal Piece
            </h2>
            <div className="flex justify-center mb-8">
              <Button
                onClick={switchToImageSearch}
                variant="outline"
                className="border-black/30 text-black hover:bg-gradient-to-r hover:from-black hover:to-gray-800 hover:text-white font-light text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-500 glass-effect px-8 py-3"
              >
                <Camera className="w-4 h-4 mr-3" />
                Switch to Image
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Progress Indicator */}
        {(currentStep !== 'capture' && currentStep !== 'custom-search') && (
          <div className="mb-20">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between relative">
                {/* Enhanced progress line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-black via-gray-700 to-gray-900 transition-all duration-1000 ease-out rounded-full shadow-sm"
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
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                        isActive 
                          ? 'bg-gradient-to-br from-black via-gray-800 to-gray-900 text-white scale-110 shadow-xl'
                          : isCompleted
                          ? 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100 text-black scale-105'
                          : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-400 border border-gray-200/50'
                      }`}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div className="mt-5 text-center">
                        <p className={`text-sm font-medium tracking-wider uppercase ${
                          isActive ? 'text-black' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 max-w-24 font-light leading-relaxed">
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
        <div className="max-w-7xl mx-auto">
          {currentStep === 'capture' && (
            <div className="animate-fade-in">
              <ImageCapture onImageCaptured={handleImageCaptured} />
              
              {/* Enhanced Features Section with Luxury Design */}
              <div className="mt-32 grid md:grid-cols-3 gap-12">
                <Card className="p-12 text-center hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 border-gray-200/30 glass-luxury backdrop-blur-sm group">
                  <div className="w-20 h-20 bg-gradient-to-br from-black via-gray-700 to-gray-900 rounded-xl flex items-center justify-center mx-auto mb-10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-elegant gradient-text-luxury mb-6 tracking-wide text-shadow-luxury">Precision Recognition</h3>
                  <p className="text-gray-600 text-lg font-light leading-relaxed tracking-wide">Advanced AI identifies luxury items with exceptional accuracy and precision</p>
                </Card>
                
                <Card className="p-12 text-center hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 border-gray-200/30 glass-luxury backdrop-blur-sm group">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800 via-gray-600 to-black rounded-xl flex items-center justify-center mx-auto mb-10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-elegant gradient-text-luxury mb-6 tracking-wide text-shadow-luxury">Curated Discovery</h3>
                  <p className="text-gray-600 text-lg font-light leading-relaxed tracking-wide">Find similar pieces from premier luxury retailers worldwide with expert curation</p>
                </Card>
                
                <Card className="p-12 text-center hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 border-gray-200/30 glass-luxury backdrop-blur-sm group">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-900 via-gray-700 to-black rounded-xl flex items-center justify-center mx-auto mb-10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-elegant gradient-text-luxury mb-6 tracking-wide text-shadow-luxury">Style Intelligence</h3>
                  <p className="text-gray-600 text-lg font-light leading-relaxed tracking-wide">Discover pieces that elevate your personal aesthetic with intelligent recommendations</p>
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
                <h2 className="text-5xl font-bold bg-gradient-to-r from-black via-gray-700 to-gray-900 bg-clip-text text-transparent mb-6 tracking-wide">
                  Select Your Item
                </h2>
                <p className="text-gray-600 text-xl font-light">
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
                <h2 className="text-5xl font-bold bg-gradient-to-r from-black via-gray-700 to-gray-900 bg-clip-text text-transparent mb-6 tracking-wide">
                  Describe Your Item
                </h2>
                <p className="text-gray-600 text-xl font-light">
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
                <h2 className="text-5xl font-bold bg-gradient-to-r from-black via-gray-700 to-gray-900 bg-clip-text text-transparent mb-6 tracking-wide">
                  Your Curated Matches
                </h2>
                <p className="text-gray-600 text-xl font-light">
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
