import { useState } from 'react';
import { Camera, Upload, Search, Sparkles, Zap, Eye, Target, Type, Star, Crown, Gem } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-yellow-50/30 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-yellow-400/20 via-yellow-500/10 to-orange-400/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-black/10 via-gray-900/5 to-yellow-400/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-yellow-400/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Luxury Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-luxury">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-16 h-16 saks-gradient rounded-3xl flex items-center justify-center shadow-gold hover-lift">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 saks-gold-gradient rounded-full animate-glow-pulse flex items-center justify-center">
                  <Gem className="w-2.5 h-2.5 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold saks-text-gradient text-shadow-luxury">
                  HauteAi
                </h1>
                <p className="text-sm text-gray-600 font-medium font-body tracking-wide">
                  Your Personal Stylist with Vision & Vogue
                </p>
              </div>
            </div>
            {(currentStep !== 'capture' && currentStep !== 'custom-search') && (
              <Button
                onClick={resetApp}
                variant="outline"
                className="border-2 border-gray-200 text-black hover:bg-gray-50 hover:border-yellow-400 transition-all duration-300 hover:scale-105 font-medium px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl"
              >
                <Camera className="w-5 h-5 mr-2" />
                New Search
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Enhanced Hero Section */}
        {currentStep === 'capture' && (
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-yellow-50 px-6 py-3 rounded-full mb-8 border border-yellow-200/50 shadow-lg">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800 font-body">Premium Fashion Discovery</span>
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            
            <h2 className="text-7xl font-display font-bold text-black mb-8 leading-tight text-shadow-luxury">
              Find Your Perfect
              <span className="saks-text-gradient block mt-2">
                Fashion Match
              </span>
            </h2>
            
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12 font-body">
              Upload any fashion photo and let our advanced AI identify and find similar items from premium retailers worldwide. 
              Or describe your dream piece and discover your perfect style, instantly.
            </p>
            
            {/* Enhanced Search Mode Toggle */}
            <div className="flex justify-center mb-12">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-3 border border-gray-200/50 shadow-luxury">
                <div className="flex space-x-3">
                  <Button
                    onClick={switchToImageSearch}
                    variant={searchMode === 'image' ? 'default' : 'ghost'}
                    className={`px-8 py-4 rounded-2xl transition-all duration-300 font-medium ${
                      searchMode === 'image'
                        ? 'saks-gradient text-white shadow-gold hover:shadow-xl'
                        : 'text-gray-700 hover:text-black hover:bg-gray-100/80'
                    }`}
                  >
                    <Camera className="w-5 h-5 mr-3" />
                    Search by Image
                  </Button>
                  <Button
                    onClick={switchToCustomSearch}
                    variant={searchMode === 'text' ? 'default' : 'ghost'}
                    className={`px-8 py-4 rounded-2xl transition-all duration-300 font-medium ${
                      searchMode === 'text'
                        ? 'saks-gradient text-white shadow-gold hover:shadow-xl'
                        : 'text-gray-700 hover:text-black hover:bg-gray-100/80'
                    }`}
                  >
                    <Type className="w-5 h-5 mr-3" />
                    Search by Description
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Custom Search Hero */}
        {currentStep === 'custom-search' && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-50 px-6 py-3 rounded-full mb-8 border border-blue-200/50 shadow-lg">
              <Type className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800 font-body">Text-Based Discovery</span>
            </div>
            
            <h2 className="text-6xl font-display font-bold text-black mb-6 leading-tight text-shadow-luxury">
              Describe Your
              <span className="saks-text-gradient block mt-2">
                Perfect Item
              </span>
            </h2>
            
            <div className="flex justify-center mb-8">
              <Button
                onClick={switchToImageSearch}
                variant="outline"
                className="border-2 border-gray-200 text-black hover:bg-gray-50 hover:border-yellow-400 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Camera className="w-5 h-5 mr-2" />
                Switch to Image Search
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Progress Indicator */}
        {(currentStep !== 'capture' && currentStep !== 'custom-search') && (
          <div className="mb-16">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between relative">
                {/* Enhanced progress line */}
                <div className="absolute top-8 left-0 right-0 h-2 bg-gray-200 rounded-full shadow-inner">
                  <div 
                    className="h-full saks-gradient rounded-full transition-all duration-1000 ease-out shadow-gold"
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
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-luxury ${
                        isActive 
                          ? 'saks-gradient text-white shadow-gold scale-110 animate-glow-pulse'
                          : isCompleted
                          ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-800 scale-105 shadow-lg'
                          : 'bg-white text-gray-400 border-3 border-gray-200 shadow-md'
                      }`}>
                        <StepIcon className="w-6 h-6" />
                      </div>
                      <div className="mt-4 text-center">
                        <p className={`text-base font-bold font-display ${
                          isActive ? 'text-black' : isCompleted ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 max-w-24 font-body">
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
              
              {/* Enhanced Features Section */}
              <div className="mt-20 grid md:grid-cols-3 gap-10">
                <Card className="p-8 text-center hover-lift border-0 shadow-luxury bg-white/80 backdrop-blur-lg">
                  <div className="w-16 h-16 saks-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-gold">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-black mb-4">Smart Recognition</h3>
                  <p className="text-gray-600 font-body leading-relaxed">Advanced AI identifies clothing items with 95% accuracy using computer vision</p>
                </Card>
                
                <Card className="p-8 text-center hover-lift border-0 shadow-luxury bg-white/80 backdrop-blur-lg">
                  <div className="w-16 h-16 saks-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-gold">
                    <Search className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-black mb-4">Instant Discovery</h3>
                  <p className="text-gray-600 font-body leading-relaxed">Find similar items from thousands of premium fashion retailers worldwide</p>
                </Card>
                
                <Card className="p-8 text-center hover-lift border-0 shadow-luxury bg-white/80 backdrop-blur-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-black mb-4">Style Matching</h3>
                  <p className="text-gray-600 font-body leading-relaxed">Discover items that perfectly match your unique style preferences</p>
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
                <h2 className="text-4xl font-display font-bold text-black mb-4 text-shadow-luxury">
                  Select Your Item
                </h2>
                <p className="text-gray-700 text-xl font-body">
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
              <div className="text-center mb-12">
                <h2 className="text-4xl font-display font-bold text-black mb-4 text-shadow-luxury">
                  Describe Your Item
                </h2>
                <p className="text-gray-700 text-xl font-body">
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
              <div className="text-center mb-12">
                <h2 className="text-4xl font-display font-bold text-black mb-4 text-shadow-luxury">
                  Your Fashion Matches
                </h2>
                <p className="text-gray-700 text-xl font-body">
                  Discover similar items from top fashion retailers worldwide
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