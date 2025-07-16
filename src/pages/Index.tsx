import { useState, useEffect } from 'react';
import { Camera, Upload, Search, Sparkles, Zap, Eye, Target, Type, Star, Crown, Gem, ArrowRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { ImageCapture } from '@/components/ImageCapture';
import { ImageSelector } from '@/components/ImageSelector';
import { SearchResults } from '@/components/SearchResults';
import { OutfitDescriptor } from '@/components/OutfitDescriptor';
import { CustomSearch } from '@/components/CustomSearch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAudio } from '@/hooks/useAudio';
import { InteractiveVideo } from '@/components/InteractiveVideo';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'capture' | 'select' | 'describe' | 'search' | 'custom-search'>('capture');
  const [searchMode, setSearchMode] = useState<'image' | 'text'>('image');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; width: number; height: number; containerWidth: number; containerHeight: number } | null>(null);
  const [outfitDescription, setOutfitDescription] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  const { playHoverSound, playClickSound } = useAudio();

  // Interactive mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Audio-enabled hover handler
  const handleAudioHover = () => {
    if (soundEnabled) {
      playHoverSound();
    }
  };

  // Audio-enabled click handler
  const handleAudioClick = () => {
    if (soundEnabled) {
      playClickSound();
    }
  };

  // Confetti effect for successful actions
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleImageCaptured = (imageUrl: string) => {
    setCapturedImage(imageUrl);
    setCurrentStep('select');
    triggerConfetti();
    handleAudioClick();
  };

  const handleAreaSelected = (area: any) => {
    setSelectedArea(area);
    setCurrentStep('describe');
    triggerConfetti();
    handleAudioClick();
  };

  const handleDescriptionComplete = (description: string) => {
    setOutfitDescription(description);
    setCurrentStep('search');
    triggerConfetti();
    handleAudioClick();
  };

  const handleCustomSearch = (searchQuery: string) => {
    setOutfitDescription(searchQuery);
    setCurrentStep('search');
    triggerConfetti();
    handleAudioClick();
  };

  const resetApp = () => {
    setCurrentStep('capture');
    setSearchMode('image');
    setCapturedImage(null);
    setSelectedArea(null);
    setOutfitDescription('');
    handleAudioClick();
  };

  const switchToCustomSearch = () => {
    setSearchMode('text');
    setCurrentStep('custom-search');
    handleAudioClick();
  };

  const switchToImageSearch = () => {
    setSearchMode('image');
    setCurrentStep('capture');
    handleAudioClick();
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

  // Interactive floating particles
  const FloatingParticle = ({ delay = 0 }: { delay?: number }) => (
    <div 
      className="absolute w-2 h-2 bg-yellow-400/30 rounded-full animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      }}
    />
  );

  // Interactive cursor follower
  const CursorFollower = () => (
    <div 
      className="fixed w-6 h-6 pointer-events-none z-50 transition-all duration-300 ease-out"
      style={{
        left: mousePosition.x - 12,
        top: mousePosition.y - 12,
        background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        transform: `scale(${currentStep === 'capture' ? 1.5 : 1})`
      }}
    />
  );

  // Confetti component
  const Confetti = () => {
    if (!showConfetti) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          />
        ))}
      </div>
    );
  };

  const handleVideoNavigation = (section: string) => {
    switch (section) {
      case 'capture':
        setCurrentStep('capture');
        setSearchMode('image');
        break;
      case 'select':
        // Only navigate if we have a captured image
        if (capturedImage) {
          setCurrentStep('select');
        } else {
          setCurrentStep('capture');
        }
        break;
      case 'describe':
        // Only navigate if we have selected area
        if (selectedArea) {
          setCurrentStep('describe');
        } else {
          setCurrentStep('capture');
        }
        break;
      case 'search':
        setCurrentStep('search');
        break;
      default:
        setCurrentStep('capture');
    }
    triggerConfetti();
    handleAudioClick();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-yellow-50/30 relative overflow-hidden">
      <CursorFollower />
      <Confetti />
      
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-yellow-400/20 via-yellow-500/10 to-orange-400/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-black/10 via-gray-900/5 to-yellow-400/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-yellow-400/5 to-transparent rounded-full blur-3xl"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Enhanced Header with interactive controls */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-luxury">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div 
                className="relative group cursor-pointer" 
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  handleAudioClick();
                }}
                onMouseEnter={handleAudioHover}
              >
                <div className="w-16 h-16 saks-gradient rounded-3xl flex items-center justify-center shadow-gold hover-lift transition-all duration-300 hover:scale-110">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 saks-gold-gradient rounded-full animate-glow-pulse flex items-center justify-center">
                  <Gem className="w-2.5 h-2.5 text-black" />
                </div>
                {/* Play/Pause indicator */}
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                  {isPlaying ? <Pause className="w-3 h-3 text-gray-600" /> : <Play className="w-3 h-3 text-gray-600" />}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold saks-text-gradient text-shadow-luxury cursor-pointer hover:scale-105 transition-transform duration-300">
                  HauteAi
                </h1>
                <p className="text-sm text-gray-600 font-medium font-body tracking-wide">
                  Your Personal Stylist with Vision & Vogue
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sound toggle */}
              <Button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  handleAudioClick();
                }}
                onMouseEnter={handleAudioHover}
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full hover:bg-yellow-100 transition-all duration-300"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              
              {(currentStep !== 'capture' && currentStep !== 'custom-search') && (
                <Button
                  onClick={resetApp}
                  onMouseEnter={handleAudioHover}
                  variant="outline"
                  className="border-2 border-gray-200 text-black hover:bg-gray-50 hover:border-yellow-400 transition-all duration-300 hover:scale-105 font-medium px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl group"
                >
                  <Camera className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  New Search
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Enhanced Hero Section with interactive elements */}
        {currentStep === 'capture' && (
          <div className="animate-fade-in">
            {/* Hero content */}
            <div className="text-center mb-16 animate-fade-in">
              <div 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-yellow-50 px-6 py-3 rounded-full mb-8 border border-yellow-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                onMouseEnter={handleAudioHover}
              >
                <Star className="w-4 h-4 text-yellow-600 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-sm font-semibold text-yellow-800 font-body">Premium Fashion Discovery</span>
                <Star className="w-4 h-4 text-yellow-600 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
              </div>
              
              <h2 className="text-7xl font-display font-bold text-black mb-8 leading-tight text-shadow-luxury hover:scale-105 transition-transform duration-500 cursor-default">
                Find Your Perfect
                <span className="saks-text-gradient block mt-2 animate-glow-pulse">
                  Fashion Match
                </span>
              </h2>
              
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12 font-body hover:text-gray-900 transition-colors duration-300">
                Upload any fashion photo and let our advanced AI identify and find similar items from premium retailers worldwide. 
                Or describe your dream piece and discover your perfect style, instantly.
              </p>
              
              {/* Enhanced Search Mode Toggle with animations */}
              <div className="flex justify-center mb-12">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-3 border border-gray-200/50 shadow-luxury hover:shadow-2xl transition-all duration-500">
                  <div className="flex space-x-3">
                    <Button
                      onClick={switchToImageSearch}
                      onMouseEnter={handleAudioHover}
                      variant={searchMode === 'image' ? 'default' : 'ghost'}
                      className={`px-8 py-4 rounded-2xl transition-all duration-300 font-medium group ${
                        searchMode === 'image'
                          ? 'saks-gradient text-white shadow-gold hover:shadow-xl'
                          : 'text-gray-700 hover:text-black hover:bg-gray-100/80'
                      }`}
                    >
                      <Camera className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                      Search by Image
                    </Button>
                    <Button
                      onClick={switchToCustomSearch}
                      onMouseEnter={handleAudioHover}
                      variant={searchMode === 'text' ? 'default' : 'ghost'}
                      className={`px-8 py-4 rounded-2xl transition-all duration-300 font-medium group ${
                        searchMode === 'text'
                          ? 'saks-gradient text-white shadow-gold hover:shadow-xl'
                          : 'text-gray-700 hover:text-black hover:bg-gray-100/80'
                      }`}
                    >
                      <Type className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                      Search by Description
                    </Button>
                  </div>
                </div>
              </div>

              {/* Interactive demo button */}
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    console.log('Demo started');
                    triggerConfetti();
                    handleAudioClick();
                  }}
                  onMouseEnter={handleAudioHover}
                  variant="outline"
                  className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 px-8 py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Play className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                  Try Interactive Demo
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>

            {/* Interactive Video Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <div 
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-50 px-6 py-3 rounded-full mb-8 border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                  onMouseEnter={handleAudioHover}
                >
                  <Play className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span className="text-sm font-semibold text-purple-800 font-body">Interactive Demo</span>
                </div>
                
                <h3 className="text-4xl font-display font-bold text-black mb-4 leading-tight text-shadow-luxury">
                  Watch & Navigate
                  <span className="saks-text-gradient block mt-2">
                    Your Fashion Journey
                  </span>
                </h3>
                
                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8 font-body">
                  Watch our interactive demo and click on different sections to explore the features in real-time.
                </p>
              </div>

              <InteractiveVideo 
                onNavigate={handleVideoNavigation}
                onAudioHover={handleAudioHover}
                onAudioClick={handleAudioClick}
                soundEnabled={soundEnabled}
              />
            </div>

            <ImageCapture onImageCaptured={handleImageCaptured} />
            
            {/* Enhanced Features Section with interactive cards */}
            <div className="mt-20 grid md:grid-cols-3 gap-10">
              <Card 
                className="p-8 text-center hover-lift border-0 shadow-luxury bg-white/80 backdrop-blur-lg group cursor-pointer transition-all duration-500 hover:bg-white/90"
                onMouseEnter={handleAudioHover}
              >
                <div className="w-16 h-16 saks-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-gold group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-8 h-8 text-white group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl font-display font-bold text-black mb-4 group-hover:text-yellow-700 transition-colors duration-300">Smart Recognition</h3>
                <p className="text-gray-600 font-body leading-relaxed group-hover:text-gray-800 transition-colors duration-300">Advanced AI identifies clothing items with 95% accuracy using computer vision</p>
              </Card>
              
              <Card 
                className="p-8 text-center hover-lift border-0 shadow-luxury bg-white/80 backdrop-blur-lg group cursor-pointer transition-all duration-500 hover:bg-white/90"
                onMouseEnter={handleAudioHover}
              >
                <div className="w-16 h-16 saks-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-gold group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-8 h-8 text-black group-hover:animate-spin" style={{ animationDuration: '2s' }} />
                </div>
                <h3 className="text-xl font-display font-bold text-black mb-4 group-hover:text-yellow-700 transition-colors duration-300">Instant Discovery</h3>
                <p className="text-gray-600 font-body leading-relaxed group-hover:text-gray-800 transition-colors duration-300">Find similar items from thousands of premium fashion retailers worldwide</p>
              </Card>
              
              <Card 
                className="p-8 text-center hover-lift border-0 shadow-luxury bg-white/80 backdrop-blur-lg group cursor-pointer transition-all duration-500 hover:bg-white/90"
                onMouseEnter={handleAudioHover}
              >
                <div className="w-16 h-16 saks-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-black group-hover:animate-bounce" />
                </div>
                <h3 className="text-xl font-display font-bold text-black mb-4 group-hover:text-yellow-700 transition-colors duration-300">Style Matching</h3>
                <p className="text-gray-600 font-body leading-relaxed group-hover:text-gray-800 transition-colors duration-300">Discover items that perfectly match your unique style preferences</p>
              </Card>
            </div>
          </div>
        )}

        {/* Enhanced Custom Search Hero */}
        {currentStep === 'custom-search' && (
          <div className="text-center mb-12 animate-fade-in">
            <div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-50 px-6 py-3 rounded-full mb-8 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              onMouseEnter={handleAudioHover}
            >
              <Type className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-semibold text-blue-800 font-body">Text-Based Discovery</span>
            </div>
            
            <h2 className="text-6xl font-display font-bold text-black mb-6 leading-tight text-shadow-luxury hover:scale-105 transition-transform duration-500 cursor-default">
              Describe Your
              <span className="saks-text-gradient block mt-2 animate-glow-pulse">
                Perfect Item
              </span>
            </h2>
            
            <div className="flex justify-center mb-8">
              <Button
                onClick={switchToImageSearch}
                onMouseEnter={handleAudioHover}
                variant="outline"
                className="border-2 border-gray-200 text-black hover:bg-gray-50 hover:border-yellow-400 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Camera className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Switch to Image Search
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Progress Indicator with interactive elements */}
        {(currentStep !== 'capture' && currentStep !== 'custom-search') && (
          <div className="mb-16">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between relative">
                {/* Enhanced progress line with animation */}
                <div className="absolute top-8 left-0 right-0 h-2 bg-gray-200 rounded-full shadow-inner">
                  <div 
                    className="h-full saks-gradient rounded-full transition-all duration-1000 ease-out shadow-gold relative overflow-hidden"
                    style={{
                      width: `${(currentSteps.findIndex(s => s.id === currentStep) / (currentSteps.length - 1)) * 100}%`
                    }}
                  >
                    {/* Animated shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                
                {currentSteps.map((step, index) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = index < currentSteps.findIndex(s => s.id === currentStep);
                  const StepIcon = step.icon;
                  
                  return (
                    <div 
                      key={step.id} 
                      className="flex flex-col items-center relative z-10 group cursor-pointer"
                      onMouseEnter={handleAudioHover}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-luxury hover:scale-110 ${
                        isActive 
                          ? 'saks-gradient text-white shadow-gold scale-110 animate-glow-pulse'
                          : isCompleted
                          ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-800 scale-105 shadow-lg hover:shadow-xl'
                          : 'bg-white text-gray-400 border-3 border-gray-200 shadow-md hover:border-yellow-300 hover:text-gray-600'
                      }`}>
                        <StepIcon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                      </div>
                      <div className="mt-4 text-center">
                        <p className={`text-base font-bold font-display transition-colors duration-300 ${
                          isActive ? 'text-black' : isCompleted ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-600'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 max-w-24 font-body group-hover:text-gray-700 transition-colors duration-300">
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
              
              {/* Enhanced Features Section with interactive cards */}
              <div className="mt-20 grid md:grid-cols-3 gap-10">
                <Card 
                  className="p-8 text-center hover-lift border-0 shadow-luxury bg-white/80 backdrop-blur-lg group cursor-pointer transition-all duration-500 hover:bg-white/90"
                  onMouseEnter={handleAudioHover}
                >
                  <div className="w-16 h-16 saks-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-gold group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-8 h-8 text-white group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-black mb-4 group-hover:text-yellow-700 transition-colors duration-300">Smart Recognition</h3>
                  <p className="text-gray-600 font-body leading-relaxed group-hover:text-gray-800 transition-colors duration-300">Advanced AI identifies clothing items with 95% accuracy using computer vision</p>
                </Card>
                
                <Card 
                  className="p-8 text-center hover-lift border-0 shadow-luxury bg-white/80 backdrop-blur-lg group cursor-pointer transition-all duration-500 hover:bg-white/90"
                  onMouseEnter={handleAudioHover}
                >
                  <div className="w-16 h-16 saks-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-gold group-hover:scale-110 transition-transform duration-300">
                    <Search className="w-8 h-8 text-black group-hover:animate-spin" style={{ animationDuration: '2s' }} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-black mb-4 group-hover:text-yellow-700 transition-colors duration-300">Instant Discovery</h3>
                  <p className="text-gray-600 font-body leading-relaxed group-hover:text-gray-800 transition-colors duration-300">Find similar items from thousands of premium fashion retailers worldwide</p>
                </Card>
                
                <Card 
                  className="p-8 text-center hover-lift border-0 shadow-luxury bg-white/80 backdrop-blur-lg group cursor-pointer transition-all duration-500 hover:bg-white/90"
                  onMouseEnter={handleAudioHover}
                >
                  <div className="w-16 h-16 saks-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-black group-hover:animate-bounce" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-black mb-4 group-hover:text-yellow-700 transition-colors duration-300">Style Matching</h3>
                  <p className="text-gray-600 font-body leading-relaxed group-hover:text-gray-800 transition-colors duration-300">Discover items that perfectly match your unique style preferences</p>
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
                <h2 className="text-4xl font-display font-bold text-black mb-4 text-shadow-luxury hover:scale-105 transition-transform duration-300 cursor-default">
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
                <h2 className="text-4xl font-display font-bold text-black mb-4 text-shadow-luxury hover:scale-105 transition-transform duration-300 cursor-default">
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
                <h2 className="text-4xl font-display font-bold text-black mb-4 text-shadow-luxury hover:scale-105 transition-transform duration-300 cursor-default">
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
