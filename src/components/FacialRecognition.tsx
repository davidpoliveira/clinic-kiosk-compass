
import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
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
  const { toast } = useToast();

  useEffect(() => {
    if (scanning) {
      const simulateScan = () => {
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setScanning(false);
              toast({
                title: "Face scan complete",
                description: "Your identity has been verified",
              });
              onComplete();
              return 100;
            }
            return prev + 5;
          });
        }, 100);
        
        return () => clearInterval(interval);
      };
      
      simulateScan();
    }
  }, [scanning, onComplete, toast]);

  const startScan = () => {
    setProgress(0);
    setScanning(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8">
        <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-200 relative overflow-hidden border-4 ${scanning ? 'border-kiosk-blue animate-pulse' : 'border-gray-300'}`}>
          {/* Camera outline */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-full w-full p-8 text-gray-400"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          
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
              onClick={() => {
                setScanning(false);
                onCancel();
              }}
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
