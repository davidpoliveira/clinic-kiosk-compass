
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Patient } from "@/types/patient";
import { useLanguage } from "@/hooks/use-language";

interface CompletionScreenProps {
  patient: Patient;
  onNewPatient: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  patient,
  onNewPatient,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center animate-fade-in">
      <div className="mb-6">
        <div className="rounded-full bg-green-100 p-4 mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {t("thankYou")}
        </h2>
        <p className="text-xl text-gray-600">
          {t("checkIn")}
        </p>
      </div>

      <div className="w-full max-w-md bg-gray-100 rounded-lg p-6 mb-8">
        <div className="text-left">
          <h3 className="font-medium mb-2">{patient.name}</h3>
          <p className="text-gray-600 text-sm mb-4">
            {patient.procedures.length > 1
              ? `${patient.procedures.length} procedures scheduled today`
              : "1 procedure scheduled today"}
          </p>
          
          {patient.procedures.map((procedure) => (
            <div key={procedure.id} className="mb-2 last:mb-0 bg-white p-3 rounded-md">
              <p className="font-medium">{procedure.name}</p>
              <p className="text-sm text-gray-600">
                {procedure.location}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <Button
          onClick={onNewPatient}
          className="bg-kiosk-blue hover:bg-kiosk-darkblue text-white px-8 py-6 text-lg"
        >
          {t("newPatient")}
        </Button>
      </div>
    </div>
  );
};

export default CompletionScreen;
