
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
          description: "Please select an image file.",
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
    <div className="space-y-8">
      {!isCapturing ? (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Camera Option */}
          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative p-8 text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">Take Photo</h3>
                <p className="text-gray-600 leading-relaxed">
                  Capture fashion items in real-time with your camera for instant AI analysis
                </p>
              </div>
              <Button 
                onClick={startCamera}
                size="lg"
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              >
                <Camera className="w-5 h-5 mr-3" />
                Start Camera
              </Button>
            </div>
          </Card>

          {/* Upload Option */}
          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative p-8 text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">Upload Image</h3>
                <p className="text-gray-600 leading-relaxed">
                  Select an existing photo from your device to discover similar fashion items
                </p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
                className="w-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-semibold py-4 rounded-xl transition-all duration-300 group-hover:scale-105"
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
              
              {/* Overlay guide */}
              <div className="absolute inset-4 border-2 border-white/50 border-dashed rounded-xl pointer-events-none">
                <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
                  Position item here
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={capturePhoto}
                size="lg"
                className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Image className="w-5 h-5 mr-3" />
                Capture Photo
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-3 rounded-xl transition-all duration-300"
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
