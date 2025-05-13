
import React, { useState } from "react";
import KioskLayout from "@/components/KioskLayout";
import FacialRecognition from "@/components/FacialRecognition";
import CPFInput from "@/components/CPFInput";
import PatientConfirmation from "@/components/PatientConfirmation";
import CompletionScreen from "@/components/CompletionScreen";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Check } from "lucide-react";
import { Patient } from "@/types/patient";
import { getRandomPatient } from "@/services/patientService";
import { useLanguage } from "@/hooks/use-language";

type KioskStep = "welcome" | "identification" | "confirmation" | "completion";

const Index = () => {
  const [step, setStep] = useState<KioskStep>("welcome");
  const [identificationMethod, setIdentificationMethod] = useState<"face" | "cpf">("face");
  const [patient, setPatient] = useState<Patient | null>(null);
  const { t } = useLanguage();

  const handleStartIdentification = (method: "face" | "cpf") => {
    setIdentificationMethod(method);
    setStep("identification");
  };

  const handleIdentificationComplete = () => {
    // Get a random patient for demo purposes
    const randomPatient = getRandomPatient();
    setPatient(randomPatient);
    setStep("confirmation");
  };

  const handleConfirm = () => {
    setStep("completion");
  };

  const handleBack = () => {
    if (step === "identification") {
      setStep("welcome");
    } else if (step === "confirmation") {
      setStep("identification");
    }
  };

  const handleNewPatient = () => {
    setStep("welcome");
    setPatient(null);
  };

  const renderStepIndicator = () => {
    if (step === "welcome") return null;
    
    return (
      <div className="flex items-center justify-between mb-6 bg-gray-100 p-3 rounded-lg">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-gray-600"
          onClick={handleBack}
          disabled={step === "completion"}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${step === "identification" ? "bg-kiosk-blue" : "bg-gray-300"}`}></div>
          <div className={`h-2 w-2 rounded-full ${step === "confirmation" ? "bg-kiosk-blue" : "bg-gray-300"}`}></div>
          <div className={`h-2 w-2 rounded-full ${step === "completion" ? "bg-kiosk-blue" : "bg-gray-300"}`}></div>
        </div>
        
        <div className="text-sm font-medium">
          Step {step === "identification" ? "1" : step === "confirmation" ? "2" : "3"} of 3
        </div>
      </div>
    );
  };

  return (
    <KioskLayout>
      <div className="max-w-4xl mx-auto">
        {renderStepIndicator()}
        
        {step === "welcome" && (
          <div className="text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {t("welcome")}
            </h1>
            <p className="text-xl mb-8 text-gray-600">
              {t("selectIdentificationMethod")}
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div 
                className="border rounded-xl p-6 hover:border-kiosk-blue hover:shadow-md transition-all cursor-pointer bg-white"
                onClick={() => handleStartIdentification("face")}
              >
                <div className="mb-4 bg-kiosk-blue bg-opacity-10 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-8 w-8 text-kiosk-blue" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{t("facialRecognition")}</h2>
                <p className="text-gray-600">{t("facialDesc")}</p>
              </div>
              
              <div 
                className="border rounded-xl p-6 hover:border-kiosk-blue hover:shadow-md transition-all cursor-pointer bg-white"
                onClick={() => handleStartIdentification("cpf")}
              >
                <div className="mb-4 bg-kiosk-blue bg-opacity-10 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-8 w-8 text-kiosk-blue"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <path d="M7 7h10" />
                    <path d="M7 12h10" />
                    <path d="M7 17h7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">{t("cpfNumber")}</h2>
                <p className="text-gray-600">{t("cpfDesc")}</p>
              </div>
            </div>
            
            {/* Integration Partners Section */}
            <div className="mt-16 mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-6">{t("integrationPartners")}</h3>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                <img src="/lovable-uploads/21cbfb6f-3c99-492b-9b80-12c6c6177833.png" alt="TASY" className="h-12 object-contain" />
                <img src="/lovable-uploads/32f7bc41-fd4b-498b-96f0-657c6a261196.png" alt="API" className="h-12 object-contain" />
                <img src="/lovable-uploads/c589a83c-9312-461a-b81c-6ed7ec4610b8.png" alt="Pixeon" className="h-10 object-contain" />
                <img src="/lovable-uploads/69ab7107-73e2-44ee-a6f8-8994a5e79f1f.png" alt="MV" className="h-12 object-contain" />
              </div>
            </div>
            
            <div className="mt-12 text-center text-sm text-gray-500">
              <p>{t("needHelp")}</p>
            </div>
          </div>
        )}

        {step === "identification" && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">{t("patientIdentification")}</h2>
            
            <Tabs defaultValue={identificationMethod} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="face" onClick={() => setIdentificationMethod("face")}>
                  <User className="h-4 w-4 mr-2" />
                  {t("facialRecognition")}
                </TabsTrigger>
                <TabsTrigger value="cpf" onClick={() => setIdentificationMethod("cpf")}>
                  <Check className="h-4 w-4 mr-2" />
                  {t("cpfNumber")}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="face" className="mt-0">
                <FacialRecognition 
                  onComplete={handleIdentificationComplete}
                  onCancel={handleBack}
                />
              </TabsContent>
              
              <TabsContent value="cpf" className="mt-0">
                <CPFInput 
                  onComplete={handleIdentificationComplete}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {step === "confirmation" && patient && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">{t("confirmIdentity")}</h2>
            <PatientConfirmation 
              patient={patient} 
              onConfirm={handleConfirm}
              onCancel={handleBack}
            />
          </div>
        )}

        {step === "completion" && patient && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <CompletionScreen 
              patient={patient}
              onNewPatient={handleNewPatient}
            />
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default Index;
