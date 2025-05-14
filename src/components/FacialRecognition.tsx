
import React, { useState, useEffect, useRef } from "react";
import { Loader, Camera, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface FacialRecognitionProps {
  onComplete: () => void;
  onCancel: () => void;
}

const FacialRecognition: React.FC<FacialRecognitionProps> = ({ 
  onComplete,
  onCancel 
}) => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Handle camera initialization
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera error",
        description: "Could not access camera. Please allow camera permissions.",
        variant: "destructive"
      });
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  };

  // Start the facial scanning process
  const startScan = () => {
    if (!cameraActive) {
      initializeCamera();
    }
    
    setProgress(0);
    setScanning(true);
  };

  // Handle scan simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (scanning) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (interval) clearInterval(interval);
            setScanning(false);
            setTimeout(() => {
              toast({
                title: "Face scan complete",
                description: "Your identity has been verified",
              });
              onComplete();
            }, 0);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [scanning, onComplete, toast]);

  // Initialize camera on component mount
  useEffect(() => {
    const loadCamera = async () => {
      if (!cameraActive) {
        await initializeCamera();
      }
    };
    
    loadCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const handleCancel = () => {
    setScanning(false);
    stopCamera();
    onCancel();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8">
        <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full relative overflow-hidden border-4 ${scanning ? 'border-kiosk-blue animate-pulse' : 'border-gray-300'}`}>
          {/* Video feed from camera */}
          <video 
            ref={videoRef}
            className="h-full w-full object-cover" 
            autoPlay 
            playsInline 
            muted
          />
          
          {/* Camera placeholder shown only when camera is not active */}
          {!cameraActive && (
            <div className="h-full w-full absolute top-0 left-0 bg-gray-200 flex items-center justify-center">
              <Camera className="h-24 w-24 text-gray-400" />
            </div>
          )}
          
          {/* Scanning animation */}
          {scanning && (
            <>
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
              <div className="absolute left-0 right-0 h-1 bg-kiosk-blue" 
                style={{ 
                  top: `${(progress)}%`, 
                  transition: 'top 0.2s ease-out'
                }}>
              </div>
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <Loader className="h-12 w-12 text-kiosk-blue animate-spin" />
              </div>
            </>
          )}
        </div>
        
        {/* Pulsing ring animation */}
        {scanning && (
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-kiosk-blue animate-pulse-ring"></div>
        )}
        
        {/* Camera controls */}
        {cameraActive && !scanning && (
          <button 
            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
            onClick={stopCamera}
          >
            <XCircle className="h-6 w-6 text-gray-600" />
          </button>
        )}
      </div>
      
      <div className="space-y-4 w-full max-w-xs">
        {scanning ? (
          <>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-kiosk-blue h-4 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}>
              </div>
            </div>
            <p className="text-center text-gray-600">Scanning... {progress}%</p>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button 
            className="w-full bg-kiosk-blue hover:bg-kiosk-darkblue text-white text-lg py-6"
            onClick={startScan}
          >
            Start Face Recognition
          </Button>
        )}
      </div>
    </div>
  );
};

export default FacialRecognition;
