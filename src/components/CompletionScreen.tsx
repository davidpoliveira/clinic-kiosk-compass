
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Patient } from "@/types/patient";

interface CompletionScreenProps {
  patient: Patient;
  onNewPatient: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ 
  patient, 
  onNewPatient 
}) => {
  return (
    <div className="flex flex-col items-center max-w-md mx-auto text-center animate-fade-in">
      <div className="rounded-full bg-kiosk-green bg-opacity-20 p-6 mb-6">
        <CheckCircle className="h-16 w-16 text-kiosk-green" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Check-in Complete!</h2>
      
      <p className="text-lg mb-6">
        Welcome, {patient.name}. Your registration is confirmed for today.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8 w-full">
        <h3 className="font-semibold text-kiosk-blue mb-2">Next Steps:</h3>
        <ol className="text-left space-y-2 pl-4">
          <li>Please take a seat in the waiting area</li>
          <li>The staff will call you when it's your turn</li>
          <li>Make sure your phone is on and available</li>
        </ol>
      </div>
      
      <div className="border-t border-gray-200 pt-6 w-full">
        <p className="text-sm text-gray-500 mb-4">
          Thank you for using our self-service kiosk.
        </p>
        
        <Button 
          className="bg-kiosk-blue hover:bg-kiosk-darkblue text-white w-full"
          onClick={onNewPatient}
        >
          Finish and Return to Start
        </Button>
      </div>
    </div>
  );
};

export default CompletionScreen;
