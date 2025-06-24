import { useState, useRef } from 'react';
import { Camera, Upload, Image, Sparkles, Zap, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ImageCaptureProps {
  onImageCaptured: (imageUrl: string) => void;
}

export const ImageCapture = ({ onImageCaptured }: ImageCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      setIsProcessing(true);
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        // Add capture effect
        context.filter = 'brightness(1.2) contrast(1.1)';
        context.drawImage(video, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        setTimeout(() => {
          onImageCaptured(imageUrl);
          stopCamera();
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setTimeout(() => {
          onImageCaptured(imageUrl);
          setIsProcessing(false);
        }, 800);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setTimeout(() => {
            onImageCaptured(imageUrl);
            setIsProcessing(false);
          }, 800);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="space-y-8">
      {!isCapturing ? (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Enhanced Camera Option */}
          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-8 text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 saks-gradient rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                  <Camera className="w-10 h-10 text-white group-hover:animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 saks-gold-gradient rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-3 h-3 text-black" />
                </div>
                {/* Animated ring */}
                <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-yellow-400/30 rounded-3xl animate-ping"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-black group-hover:text-yellow-700 transition-colors duration-300">Take Photo</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  Capture fashion items in real-time with your camera for instant AI analysis
                </p>
              </div>
              <Button 
                onClick={startCamera}
                size="lg"
                className="w-full saks-gradient hover:opacity-90 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                disabled={isProcessing}
              >
                <Camera className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                {isProcessing ? 'Processing...' : 'Start Camera'}
              </Button>
            </div>
          </Card>

          {/* Enhanced Upload Option with Drag & Drop */}
          <Card 
            className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
              isDragging ? 'border-4 border-yellow-400 border-dashed bg-yellow-50' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-8 text-center space-y-6">
              <div className="relative">
                <div className={`w-20 h-20 saks-gold-gradient rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                  isDragging ? 'scale-110 animate-bounce' : ''
                }`}>
                  <Upload className="w-10 h-10 text-black group-hover:animate-bounce" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                {isDragging && (
                  <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-yellow-400 rounded-3xl animate-ping"></div>
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-black group-hover:text-yellow-700 transition-colors duration-300">
                  {isDragging ? 'Drop Image Here!' : 'Upload Image'}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  {isDragging 
                    ? 'Release to upload your fashion image'
                    : 'Select an existing photo from your device or drag & drop here'
                  }
                </p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
                className="w-full border-2 border-gray-200 text-black hover:bg-gray-50 hover:border-yellow-400 font-semibold py-4 rounded-xl transition-all duration-300 group-hover:scale-105"
                disabled={isProcessing}
              >
                <Upload className="w-5 h-5 mr-3 group-hover:translate-y-1 transition-transform duration-300" />
                {isProcessing ? 'Processing...' : 'Choose File'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </Card>
        </div>
      ) : (
        <Card className="max-w-4xl mx-auto overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-2xl border-0">
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-white">Camera Active</h3>
              <p className="text-gray-300">Position your fashion item in the frame</p>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto max-h-96 object-cover"
              />
              
              {/* Enhanced overlay guide with animation */}
              <div className="absolute inset-4 border-2 border-white/50 border-dashed rounded-xl pointer-events-none animate-pulse">
                <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                  Position item here
                </div>
                {/* Corner indicators */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-400"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-400"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-400"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-400"></div>
              </div>

              {/* Processing overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center text-white">
                    <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-lg font-semibold">Processing Image...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={capturePhoto}
                size="lg"
                disabled={isProcessing}
                className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <Image className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                {isProcessing ? 'Processing...' : 'Capture Photo'}
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                size="lg"
                disabled={isProcessing}
                className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-3 rounded-xl transition-all duration-300 group"
              >
                <RotateCcw className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};