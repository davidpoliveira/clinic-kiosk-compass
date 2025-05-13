
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Hospital, Printer } from "lucide-react";
import { Patient, Procedure } from "@/types/patient";
import { 
  formatDateOfBirth, 
  formatProcedureTime,
  formatProcedureDate,
  calculateAge 
} from "@/services/patientService";
import { toast } from "@/components/ui/use-toast";
import { printPatientTicket } from "@/services/printService";
import { useLanguage } from "@/hooks/use-language";

interface PatientConfirmationProps {
  patient: Patient;
  onConfirm: () => void;
  onCancel: () => void;
}

const PatientConfirmation: React.FC<PatientConfirmationProps> = ({
  patient,
  onConfirm,
  onCancel
}) => {
  const { t } = useLanguage();
  
  const handleConfirm = async () => {
    toast({
      title: t("printing"),
      description: t("procedureConfirmed"),
    });
    
    // Print patient ticket
    await printPatientTicket(patient);
    
    // Continue with confirmation flow
    onConfirm();
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-kiosk-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {patient.name.split(' ').map(name => name[0]).join('')}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{patient.name}</h2>
            <div className="text-gray-600">
              <p>CPF: {patient.cpf}</p>
              <p>Date of Birth: {formatDateOfBirth(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} years)</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-700">Health Insurance:</p>
            <p className="font-medium">{patient.healthInsurance}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Insurance ID:</p>
            <p className="font-medium">{patient.insuranceNumber}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Hospital className="mr-2 h-5 w-5 text-kiosk-blue" />
          {t("proceduresScheduled")} ({patient.procedures.length})
        </h3>
        
        <div className="space-y-4">
          {patient.procedures.map((procedure) => (
            <ProcedureCard key={procedure.id} procedure={procedure} />
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          {t("notMe")}
        </Button>
        <Button
          className="flex-1 bg-kiosk-blue hover:bg-kiosk-darkblue text-white"
          onClick={handleConfirm}
        >
          <Printer className="mr-2 h-4 w-4" />
          {t("confirmIdentification")}
        </Button>
      </div>
    </div>
  );
};

const ProcedureCard: React.FC<{ procedure: Procedure }> = ({ procedure }) => {
  const { t } = useLanguage();
  const procedureDate = formatProcedureDate(procedure.scheduledTime);
  const procedureTime = formatProcedureTime(procedure.scheduledTime);
  
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-semibold text-lg">{procedure.name}</h4>
          <div className="flex items-center text-gray-600 mt-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>{procedureDate} at {procedureTime}</span>
          </div>
          <p className="text-sm mt-1">{procedure.doctor}</p>
        </div>
        
        <div className="bg-kiosk-blue bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium text-kiosk-blue whitespace-nowrap">
          {procedure.location}
        </div>
      </div>
      
      {procedure.preparationRequired && (
        <div className="mt-3 bg-kiosk-lightblue bg-opacity-30 p-3 rounded-md">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-kiosk-blue mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">{t("preparationRequired")}:</p>
              <p className="text-sm text-gray-700">{procedure.preparationInstructions}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PatientConfirmation;
