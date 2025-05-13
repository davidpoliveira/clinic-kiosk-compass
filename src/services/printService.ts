
import { Patient, Procedure } from "@/types/patient";
import { formatDateOfBirth, formatProcedureDate, formatProcedureTime } from "@/services/patientService";
import { toast } from "@/components/ui/use-toast";

export const printPatientTicket = (patient: Patient) => {
  try {
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
    
    // Define receipt content with styling
    printWindow.document.write(`
      <html>
        <head>
          <title>Patient Check-in Receipt</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              max-width: 300px; /* Thermal printer width */
              margin: 0 auto;
              padding: 10px;
              font-size: 12px;
            }
            .header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .logo {
              max-width: 150px;
              margin: 0 auto;
              display: block;
            }
            .receipt-title {
              font-size: 14px;
              font-weight: bold;
              margin: 10px 0;
              text-align: center;
            }
            .patient-info {
              margin-bottom: 15px;
            }
            .procedure {
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px dotted #ccc;
            }
            .procedure:last-child {
              border-bottom: none;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
              border-top: 1px dashed #000;
              padding-top: 10px;
              font-size: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table td {
              padding: 3px 0;
            }
            .label {
              font-weight: bold;
            }
            .qr-placeholder {
              text-align: center;
              margin: 10px 0;
              padding: 20px;
              border: 1px solid #ccc;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img class="logo" src="/lovable-uploads/14ba4491-7b43-422f-a3ef-19ebb3a523e8.png" alt="Camasso Logo" />
            <div class="receipt-title">Patient Check-in Receipt</div>
          </div>
          
          <div class="patient-info">
            <table>
              <tr>
                <td class="label">Name:</td>
                <td>${patient.name}</td>
              </tr>
              <tr>
                <td class="label">CPF:</td>
                <td>${patient.cpf}</td>
              </tr>
              <tr>
                <td class="label">Date of Birth:</td>
                <td>${formatDateOfBirth(patient.dateOfBirth)}</td>
              </tr>
              <tr>
                <td class="label">Insurance:</td>
                <td>${patient.healthInsurance}</td>
              </tr>
            </table>
          </div>
          
          <div class="receipt-title">Scheduled Procedures</div>
          
          ${patient.procedures.map((proc: Procedure) => `
            <div class="procedure">
              <div><b>${proc.name}</b></div>
              <div>Dr. ${proc.doctor}</div>
              <div>${formatProcedureDate(proc.scheduledTime)} at ${formatProcedureTime(proc.scheduledTime)}</div>
              <div>${proc.location}</div>
            </div>
          `).join('')}
          
          <div class="qr-placeholder">
            [QR Code for check-in]
          </div>
          
          <div class="footer">
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Time: ${new Date().toLocaleTimeString()}</p>
            <p>Thank you for choosing Camasso Health Services</p>
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
