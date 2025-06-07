import { useState, useRef } from 'react';
import { Camera, Upload, Image, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ImageCaptureProps {
  onImageCaptured: (imageUrl: string) => void;
}

export const ImageCapture = ({ onImageCaptured }: ImageCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
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
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        onImageCaptured(imageUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file..",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageCaptured(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-12">
      {!isCapturing ? (
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Camera Option */}
          <Card className="group relative overflow-hidden border border-gray-200/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 glass-subtle">
            <div className="absolute inset-0 bg-gradient-to-br from-black/3 to-gray-900/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-10 text-center space-y-8">
              <div className="relative">
                <div className="w-24 h-24 gradient-bg-primary rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Camera className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-light text-gray-900 tracking-wide">Capture Photo</h3>
                <p className="text-gray-600 leading-relaxed font-light text-sm">
                  Use your camera to instantly discover similar luxury fashion pieces
                </p>
              </div>
              <Button 
                onClick={startCamera}
                size="lg"
                className="w-full btn-elegant py-4 font-light tracking-wide uppercase text-sm"
              >
                <Camera className="w-5 h-5 mr-3" />
                Start Camera
              </Button>
            </div>
          </Card>

          {/* Upload Option */}
          <Card className="group relative overflow-hidden border border-gray-200/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 glass-subtle">
            <div className="absolute inset-0 bg-gradient-to-br from-black/3 to-gray-900/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-10 text-center space-y-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-sm">
                  <Zap className="w-4 h-4 text-black" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-light text-gray-900 tracking-wide">Upload Image</h3>
                <p className="text-gray-600 leading-relaxed font-light text-sm">
                  Select an existing photo to find matching designer pieces
                </p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                size="lg"
                className="w-full btn-outline-elegant py-4 font-light tracking-wide uppercase text-sm"
              >
                <Upload className="w-5 h-5 mr-3" />
                Choose File
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
        <Card className="max-w-4xl mx-auto overflow-hidden glass-luxury shadow-lg border border-gray-200/30">
          <div className="p-10 space-y-8">
            <div className="text-center space-y-3">
              <h3 className="text-xl font-light text-gray-900 tracking-wide">Camera Active</h3>
              <p className="text-gray-600 font-light">Position your item within the frame</p>
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto max-h-96 object-cover"
              />
              
              {/* Overlay guide */}
              <div className="absolute inset-8 border border-black/30 pointer-events-none">
                <div className="absolute top-4 left-4 text-black text-sm bg-white/90 px-3 py-1 rounded">
                  Position item here
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-6">
              <Button
                onClick={capturePhoto}
                size="lg"
                className="btn-elegant px-10 py-3 font-light tracking-wide uppercase text-sm"
              >
                <Image className="w-5 h-5 mr-3" />
                Capture Photo
              </Button>
              <Button
                onClick={stopCamera}
                size="lg"
                className="btn-outline-elegant px-10 py-3 font-light tracking-wide uppercase text-sm"
              >
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