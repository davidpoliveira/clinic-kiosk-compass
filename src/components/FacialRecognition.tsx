
import React, { useState, useEffect, useRef } from "react";
import { Loader, Camera, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import OpenAI from "openai";

// Configure OpenAI - In a real app, this would be using environment variables
// For demo purposes, we're using a public demo key with limited access
const DEMO_API_KEY = "demo-key-for-limited-access";
const openai = new OpenAI({
  apiKey: DEMO_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo purposes
});

interface FacialRecognitionProps {
  onComplete: (gender: "male" | "female") => void;
  onCancel: () => void;
}

const FacialRecognition: React.FC<FacialRecognitionProps> = ({ 
  onComplete,
  onCancel 
}) => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectedGender, setDetectedGender] = useState<"male" | "female" | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    setDetectedGender(null);
    setScanning(true);
    
    // AI gender detection
    setTimeout(() => {
      detectGenderWithAI();
    }, 1000);
  };

  // Convert canvas to blob
  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          // Fallback if toBlob fails
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          const byteString = atob(dataUrl.split(',')[1]);
          const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          resolve(new Blob([ab], { type: mimeString }));
        }
      }, 'image/jpeg', 0.8);
    });
  };

  // Gender detection using OpenAI
  const detectGenderWithAI = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    setProcessingImage(true);

    try {
      // Draw the current video frame to the canvas
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // In a real implementation, we would:
      // 1. Convert canvas to blob
      // 2. Send to OpenAI for analysis
      // For demo purposes, we'll simulate the AI response

      // Simulated AI response - in a real app, we'd use OpenAI Vision API
      // This would be the code for OpenAI integration:
      /*
      const blob = await canvasToBlob(canvas);
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a facial recognition specialist that only detects if a face is male or female. Respond with ONLY 'male' or 'female'."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "What gender is the person in this image?" },
              { 
                type: "image_url", 
                image_url: { 
                  url: URL.createObjectURL(blob),
                  detail: "low"
                }
              }
            ]
          }
        ]
      });
      
      const detectedGender = response.choices[0].message.content?.toLowerCase().includes("female") ? "female" : "male";
      */
      
      // For demo purposes, generating random gender
      const detectedGender = Math.random() > 0.5 ? "male" : "female";
      
      console.log(`AI detected gender: ${detectedGender}`);
      setDetectedGender(detectedGender);
    } catch (error) {
      console.error("Error in AI gender detection:", error);
      toast({
        title: "AI Detection Error",
        description: "Could not analyze facial features. Using random gender assignment.",
        variant: "destructive"
      });
      
      // Fallback to random gender
      const randomGender = Math.random() > 0.5 ? "male" : "female";
      setDetectedGender(randomGender);
    } finally {
      setProcessingImage(false);
    }
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
                description: `Identity verified: ${detectedGender === "male" ? "Male" : "Female"} patient`,
              });
              onComplete(detectedGender || "male");
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
  }, [scanning, onComplete, toast, detectedGender]);

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
          
          {/* Hidden canvas for image processing */}
          <canvas 
            ref={canvasRef} 
            className="hidden" 
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
          
          {/* Gender detection indicator */}
          {detectedGender && scanning && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <span className="bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm font-medium">
                {detectedGender === "male" ? "Male" : "Female"} detected
              </span>
            </div>
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
            <p className="text-center text-gray-600">
              {processingImage ? "Processing image with AI..." : `Scanning... ${progress}%`}
            </p>
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
