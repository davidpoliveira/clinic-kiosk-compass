
import { Patient, Procedure } from "@/types/patient";
import { formatDateOfBirth, formatProcedureDate, formatProcedureTime } from "@/services/patientService";
import { toast } from "@/components/ui/use-toast";

const translations = {
  'en-US': {
    patientCheckIn: "Patient Check-in Receipt",
    name: "Name",
    cpf: "CPF",
    dateOfBirth: "Date of Birth",
    insurance: "Insurance",
    scheduledProcedures: "Scheduled Procedures",
    at: "at",
    qrCode: "[QR Code for check-in]",
    date: "Date",
    time: "Time",
    thankYou: "Thank you for choosing Camasso Health Services"
  },
  'pt-BR': {
    patientCheckIn: "Comprovante de Check-in do Paciente",
    name: "Nome",
    cpf: "CPF",
    dateOfBirth: "Data de Nascimento",
    insurance: "Convênio",
    scheduledProcedures: "Procedimentos Agendados",
    at: "às",
    qrCode: "[Código QR para check-in]",
    date: "Data",
    time: "Hora",
    thankYou: "Obrigado por escolher os Serviços de Saúde Camasso"
  },
  'es': {
    patientCheckIn: "Recibo de Registro del Paciente",
    name: "Nombre",
    cpf: "CPF",
    dateOfBirth: "Fecha de Nacimiento",
    insurance: "Seguro",
    scheduledProcedures: "Procedimientos Programados",
    at: "a las",
    qrCode: "[Código QR para registro]",
    date: "Fecha",
    time: "Hora",
    thankYou: "Gracias por elegir los Servicios de Salud Camasso"
  }
};

export const printPatientTicket = (patient: Patient, language: string = 'pt-BR') => {
  try {
    // Get translations for the selected language or default to English
    const t = translations[language as keyof typeof translations] || translations['en-US'];
    
    // Create the content for the receipt
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check popup settings.",
        variant: "destructive",
      });
      return;
    }
    
    // Define receipt content with styling - limited to 15cm width
    printWindow.document.write(`
      <html>
        <head>
          <title>${t.patientCheckIn}</title>
          <style>
            @media print {
              @page {
                size: 15cm auto;
                margin: 0.5cm;
              }
              body {
                width: 14cm; /* 15cm minus margins */
                max-width: 14cm;
              }
            }
            body {
              font-family: Arial, sans-serif;
              width: 14cm;
              max-width: 14cm;
              margin: 0 auto;
              padding: 0.5cm;
              font-size: 10px;
              line-height: 1.2;
            }
            .header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 5px;
              margin-bottom: 5px;
            }
            .logo {
              max-width: 5cm;
              height: auto;
              margin: 0 auto;
              display: block;
            }
            .receipt-title {
              font-size: 12px;
              font-weight: bold;
              margin: 5px 0;
              text-align: center;
            }
            .patient-info {
              margin-bottom: 10px;
            }
            .procedure {
              margin-bottom: 8px;
              padding-bottom: 4px;
              border-bottom: 1px dotted #ccc;
            }
            .procedure:last-child {
              border-bottom: none;
            }
            .footer {
              text-align: center;
              margin-top: 10px;
              border-top: 1px dashed #000;
              padding-top: 5px;
              font-size: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table td {
              padding: 2px 0;
              vertical-align: top;
            }
            .label {
              font-weight: bold;
              width: 40%;
            }
            .qr-placeholder {
              text-align: center;
              margin: 8px 0;
              padding: 8px;
              border: 1px solid #ccc;
              font-size: 8px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img class="logo" src="/lovable-uploads/14ba4491-7b43-422f-a3ef-19ebb3a523e8.png" alt="Camasso Logo" />
            <div class="receipt-title">${t.patientCheckIn}</div>
          </div>
          
          <div class="patient-info">
            <table>
              <tr>
                <td class="label">${t.name}:</td>
                <td>${patient.name}</td>
              </tr>
              <tr>
                <td class="label">${t.cpf}:</td>
                <td>${patient.cpf}</td>
              </tr>
              <tr>
                <td class="label">${t.dateOfBirth}:</td>
                <td>${formatDateOfBirth(patient.dateOfBirth)}</td>
              </tr>
              <tr>
                <td class="label">${t.insurance}:</td>
                <td>${patient.healthInsurance}</td>
              </tr>
            </table>
          </div>
          
          <div class="receipt-title">${t.scheduledProcedures}</div>
          
          ${patient.procedures.map((proc: Procedure) => `
            <div class="procedure">
              <div><b>${proc.name}</b></div>
              <div>Dr. ${proc.doctor}</div>
              <div>${formatProcedureDate(proc.scheduledTime)} ${t.at} ${formatProcedureTime(proc.scheduledTime)}</div>
              <div>${proc.location}</div>
            </div>
          `).join('')}
          
          <div class="qr-placeholder">
            ${t.qrCode}
          </div>
          
          <div class="footer">
            <p>${t.date}: ${new Date().toLocaleDateString()}</p>
            <p>${t.time}: ${new Date().toLocaleTimeString()}</p>
            <p>${t.thankYou}</p>
          </div>
        </body>
      </html>
    `);
    
    // Wait a moment for images to load
    setTimeout(() => {
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      
      // Close the window after printing (or when print dialog is closed)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 500);

    return true;
  } catch (error) {
    console.error("Error printing receipt:", error);
    toast({
      title: "Error",
      description: "Failed to print receipt. Please try again or contact staff.",
      variant: "destructive",
    });
    return false;
  }
};
