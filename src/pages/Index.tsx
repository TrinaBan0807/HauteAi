
import { useState } from 'react';
import { Camera, Upload, Search, Sparkles, Zap, Eye, Target } from 'lucide-react';
import { ImageCapture } from '@/components/ImageCapture';
import { ImageSelector } from '@/components/ImageSelector';
import { SearchResults } from '@/components/SearchResults';
import { OutfitDescriptor } from '@/components/OutfitDescriptor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

  const steps = [
    { id: 'capture', title: 'Capture', icon: Camera, description: 'Take or Upload Photo' },
    { id: 'select', title: 'Select', icon: Target, description: 'Select Item in Photo' },
    { id: 'describe', title: 'Describe', icon: Eye, description: 'Describe the Item' },
    { id: 'search', title: 'Search', icon: Search, description: 'Search Results' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-purple-100/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  HauteAi
                </h1>
                <p className="text-sm text-gray-500 font-medium">AI-Powered Fashion Search</p>
              </div>
            </div>
            {currentStep !== 'capture' && (
              <Button
                onClick={resetApp}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 hover:scale-105"
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
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Powered by Advanced AI</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Find Your Perfect
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                Fashion Match
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Upload any fashion photo and let our AI identify and find similar items from thousands of online stores. 
              Discover your style, instantly.
            </p>
          </div>
        )}

        {/* Enhanced Progress Indicator */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%`
                  }}
                />
              </div>
              
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = index < steps.findIndex(s => s.id === currentStep);
                const StepIcon = step.icon;
                
                return (
                  <div key={step.id} className="flex flex-col items-center relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg scale-110'
                        : isCompleted
                        ? 'bg-purple-200 text-purple-700 scale-105'
                        : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-semibold ${
                        isActive ? 'text-purple-700' : isCompleted ? 'text-purple-600' : 'text-gray-400'
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

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'capture' && (
            <div className="animate-fade-in">
              <ImageCapture onImageCaptured={handleImageCaptured} />
              
              {/* Features Section */}
              <div className="mt-16 grid md:grid-cols-3 gap-8">
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-purple-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Recognition</h3>
                  <p className="text-gray-600 text-sm">Advanced AI identifies clothing items with 95% accuracy</p>
                </Card>
                
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-purple-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Instant Search</h3>
                  <p className="text-gray-600 text-sm">Find similar items from thousands of online stores</p>
                </Card>
                
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-purple-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Style Matching</h3>
                  <p className="text-gray-600 text-sm">Discover items that match your unique style preferences</p>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 'select' && capturedImage && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Select Your Item
                </h2>
                <p className="text-gray-600 text-lg">
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
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Describe Your Item
                </h2>
                <p className="text-gray-600 text-lg">
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
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Your Fashion Matches
                </h2>
                <p className="text-gray-600 text-lg">
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
