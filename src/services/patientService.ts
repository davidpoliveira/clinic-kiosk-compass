
import { Patient, Procedure } from "@/types/patient";

// Sample patient data
const samplePatients: Patient[] = [
  {
    id: "1",
    name: "Maria Silva",
    dateOfBirth: "1985-06-15",
    cpf: "123.456.789-10",
    healthInsurance: "SulAmérica Saúde",
    insuranceNumber: "8765432-1",
    procedures: [
      {
        id: "p1",
        name: "Blood Test",
        scheduledTime: "2025-05-13T10:30:00",
        doctor: "Dr. Carlos Mendes",
        location: "Laboratory - Floor 2, Room 204",
        preparationRequired: true,
        preparationInstructions: "Fast for 8 hours before the test. Water is allowed.",
        status: "scheduled"
      },
      {
        id: "p2",
        name: "Chest X-Ray",
        scheduledTime: "2025-05-13T11:30:00",
        doctor: "Dr. Ana Ferreira",
        location: "Radiology - Floor 1, Room 112",
        preparationRequired: false,
        status: "scheduled"
      }
    ]
  },
  {
    id: "2",
    name: "João Santos",
    dateOfBirth: "1972-03-21",
    cpf: "987.654.321-00",
    healthInsurance: "Bradesco Saúde",
    insuranceNumber: "1234567-8",
    procedures: [
      {
        id: "p3",
        name: "Cardiologist Consultation",
        scheduledTime: "2025-05-13T14:15:00",
        doctor: "Dr. Roberto Almeida",
        location: "Cardiology - Floor 3, Room 315",
        preparationRequired: false,
        status: "scheduled"
      }
    ]
  },
  {
    id: "3",
    name: "Ana Luiza Pereira",
    dateOfBirth: "1990-11-30",
    cpf: "456.789.123-45",
    healthInsurance: "Unimed",
    insuranceNumber: "9876543-2",
    procedures: [
      {
        id: "p4",
        name: "Ultrasound",
        scheduledTime: "2025-05-13T09:00:00",
        doctor: "Dra. Juliana Costa",
        location: "Imaging - Floor 2, Room 220",
        preparationRequired: true,
        preparationInstructions: "Please drink 1L of water 40 minutes before the exam and don't urinate.",
        status: "scheduled"
      },
      {
        id: "p5",
        name: "Nutritionist Consultation",
        scheduledTime: "2025-05-13T10:00:00",
        doctor: "Dr. Marcelo Souza",
        location: "Nutrition - Floor 4, Room 405",
        preparationRequired: false,
        status: "scheduled"
      }
    ]
  },
  {
    id: "4",
    name: "Pedro Oliveira",
    dateOfBirth: "1965-08-12",
    cpf: "789.123.456-78",
    healthInsurance: "Amil",
    insuranceNumber: "4567890-1",
    procedures: [
      {
        id: "p6",
        name: "MRI Scan",
        scheduledTime: "2025-05-13T16:45:00",
        doctor: "Dr. Gustavo Lima",
        location: "Radiology - Floor 1, Room 115",
        preparationRequired: true,
        preparationInstructions: "Remove all metal objects. Inform staff of any implants.",
        status: "scheduled"
      }
    ]
  }
];

// Function to get a random patient
export function getRandomPatient(): Patient {
  const randomIndex = Math.floor(Math.random() * samplePatients.length);
  return samplePatients[randomIndex];
}

// Function to format date of birth
export function formatDateOfBirth(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

// Function to format procedure time
export function formatProcedureTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Function to format procedure date
export function formatProcedureDate(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('pt-BR');
}

// Function to calculate patient age
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
