
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Camera, Search, Eye, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface InteractiveVideoProps {
  onNavigate: (section: string) => void;
  onAudioHover?: () => void;
  onAudioClick?: () => void;
  soundEnabled?: boolean;
}

export const InteractiveVideo = ({ onNavigate, onAudioHover, onAudioClick, soundEnabled = true }: InteractiveVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const navigationPoints = [
    { 
      time: 2, 
      section: 'capture', 
      title: 'Image Capture', 
      description: 'Take or upload photos',
      icon: Camera,
      position: { top: '20%', left: '15%' }
    },
    { 
      time: 5, 
      section: 'select', 
      title: 'Item Selection', 
      description: 'Select items in photos',
      icon: Target,
      position: { top: '60%', right: '20%' }
    },
    { 
      time: 8, 
      section: 'describe', 
      title: 'AI Description', 
      description: 'Describe your items',
      icon: Eye,
      position: { bottom: '25%', left: '25%' }
    },
    { 
      time: 11, 
      section: 'search', 
      title: 'Smart Search', 
      description: 'Find similar items',
      icon: Search,
      position: { top: '40%', right: '15%' }
    }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
    onAudioClick?.();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
    onAudioClick?.();
  };

  const handleNavigate = (section: string) => {
    onNavigate(section);
    onAudioClick?.();
  };

  const getVisiblePoints = () => {
    return navigationPoints.filter(point => 
      currentTime >= point.time && currentTime < point.time + 3
    );
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden shadow-luxury bg-white/90 backdrop-blur-lg border-0">
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted={isMuted}
            playsInline
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23000'/%3E%3Ctext x='400' y='225' text-anchor='middle' fill='white' font-family='Arial' font-size='24'%3EInteractive Fashion Demo%3C/text%3E%3C/svg%3E"
          >
            {/* Placeholder for demo - in production, you'd add your video source */}
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Interactive Navigation Points */}
          {getVisiblePoints().map((point) => {
            const IconComponent = point.icon;
            return (
              <div
                key={point.section}
                className="absolute animate-fade-in"
                style={point.position}
              >
                <Button
                  onClick={() => handleNavigate(point.section)}
                  onMouseEnter={onAudioHover}
                  className="relative group bg-white/90 backdrop-blur-lg text-black hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-yellow-400/50 hover:border-yellow-400"
                  size="lg"
                >
                  <IconComponent className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-left">
                    <div className="font-bold text-sm">{point.title}</div>
                    <div className="text-xs opacity-80">{point.description}</div>
                  </div>
                  
                  {/* Pulse animation */}
                  <div className="absolute inset-0 rounded-lg bg-yellow-400/20 animate-ping group-hover:animate-none"></div>
                </Button>
              </div>
            );
          })}

          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center space-x-4">
              <Button
                onClick={togglePlay}
                onMouseEnter={onAudioHover}
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 transition-all duration-300"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>

              <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <span className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <Button
                onClick={toggleMute}
                onMouseEnter={onAudioHover}
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 transition-all duration-300"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Demo message when no video */}
          {!videoRef.current?.src && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Interactive Demo Video</h3>
                <p className="text-sm opacity-80">Click the navigation points to explore different sections</p>
              </div>
            </div>
          )}
        </div>

        {/* Section Navigation */}
        <div className="p-6 bg-gradient-to-r from-white to-gray-50">
          <h3 className="text-lg font-bold text-black mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {navigationPoints.map((point) => {
              const IconComponent = point.icon;
              return (
                <Button
                  key={point.section}
                  onClick={() => handleNavigate(point.section)}
                  onMouseEnter={onAudioHover}
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-300 group"
                >
                  <IconComponent className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">{point.title}</span>
                  <span className="text-xs text-gray-500 mt-1">{point.description}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
