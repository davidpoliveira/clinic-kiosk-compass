
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define translation dictionary
const translations = {
  'en-US': {
    welcome: 'Welcome to Camasso',
    kioskSystem: 'Self-Service System',
    language: 'Language',
    selectIdentificationMethod: 'Please select how you\'d like to identify yourself',
    facialRecognition: 'Facial Recognition',
    facialDesc: 'Quick and contactless identification using your face',
    cpfNumber: 'CPF Number',
    cpfDesc: 'Enter your CPF number to identify yourself',
    needHelp: 'Need assistance? Please ask our staff for help',
    patientIdentification: 'Patient Identification',
    confirmIdentity: 'Confirm Your Identity',
    notMe: 'Not Me / Cancel',
    confirmIdentification: 'Confirm Identification',
    proceduresScheduled: 'Scheduled Procedures',
    preparationRequired: 'Preparation Required',
    printing: 'Printing your ticket...',
    thankYou: 'Thank you!',
    procedureConfirmed: 'Your procedure has been confirmed',
    newPatient: 'New Patient',
    checkIn: 'Check-in completed successfully',
    integrationPartners: 'Integrations',
    // Queue Panel Translations
    queuePanelTitle: 'Appointment Queue',
    queuePanelSubtitle: 'Please wait for your number to be called',
    nowCalling: 'NOW CALLING',
    lessThanAMinute: 'Less than a minute',
    oneMinute: '1 minute ago',
    minutesAgo: '{minutes} minutes ago',
    // Layout options 
    layoutVertical: 'Vertical Layout',
    layoutHorizontal: 'Horizontal Layout',
    layoutCompact: 'Compact Layout',
    layoutFullscreen: 'Fullscreen Layout'
  },
  'pt-BR': {
    welcome: 'Bem-vindo ao Camasso',
    kioskSystem: 'Sistema de Autoatendimento',
    language: 'Idioma',
    selectIdentificationMethod: 'Por favor, selecione como você deseja se identificar',
    facialRecognition: 'Reconhecimento Facial',
    facialDesc: 'Identificação rápida e sem contato usando seu rosto',
    cpfNumber: 'Número do CPF',
    cpfDesc: 'Digite seu número de CPF para se identificar',
    needHelp: 'Precisa de ajuda? Por favor, peça assistência à nossa equipe',
    patientIdentification: 'Identificação do Paciente',
    confirmIdentity: 'Confirme Sua Identidade',
    notMe: 'Não Sou Eu / Cancelar',
    confirmIdentification: 'Confirmar Identificação',
    proceduresScheduled: 'Procedimentos Agendados',
    preparationRequired: 'Preparação Necessária',
    printing: 'Imprimindo seu ticket...',
    thankYou: 'Obrigado!',
    procedureConfirmed: 'Seu procedimento foi confirmado',
    newPatient: 'Novo Paciente',
    checkIn: 'Check-in realizado com sucesso',
    integrationPartners: 'Integrações',
    // Queue Panel Translations
    queuePanelTitle: 'Fila de Atendimento',
    queuePanelSubtitle: 'Aguarde seu número ser chamado',
    nowCalling: 'CHAMANDO AGORA',
    lessThanAMinute: 'Menos de um minuto',
    oneMinute: '1 minuto atrás',
    minutesAgo: '{minutes} minutos atrás',
    // Layout options
    layoutVertical: 'Layout Vertical',
    layoutHorizontal: 'Layout Horizontal',
    layoutCompact: 'Layout Compacto',
    layoutFullscreen: 'Layout Tela Cheia'
  },
  'es': {
    welcome: 'Bienvenido a Camasso',
    kioskSystem: 'Sistema de Autoservicio',
    language: 'Idioma',
    selectIdentificationMethod: 'Por favor, seleccione cómo desea identificarse',
    facialRecognition: 'Reconocimiento Facial',
    facialDesc: 'Identificación rápida y sin contacto usando su rostro',
    cpfNumber: 'Número de CPF',
    cpfDesc: 'Ingrese su número de CPF para identificarse',
    needHelp: '¿Necesita ayuda? Por favor, solicite asistencia a nuestro personal',
    patientIdentification: 'Identificación del Paciente',
    confirmIdentity: 'Confirme Su Identidad',
    notMe: 'No Soy Yo / Cancelar',
    confirmIdentification: 'Confirmar Identificación',
    proceduresScheduled: 'Procedimientos Programados',
    preparationRequired: 'Preparación Requerida',
    printing: 'Imprimiendo su ticket...',
    thankYou: '¡Gracias!',
    procedureConfirmed: 'Su procedimiento ha sido confirmado',
    newPatient: 'Nuevo Paciente',
    checkIn: 'Check-in completado con éxito',
    integrationPartners: 'Integraciones',
    // Queue Panel Translations
    queuePanelTitle: 'Cola de Atención',
    queuePanelSubtitle: 'Espere a que su número sea llamado',
    nowCalling: 'LLAMANDO AHORA',
    lessThanAMinute: 'Menos de un minuto',
    oneMinute: '1 minuto atrás',
    minutesAgo: 'Hace {minutes} minutos',
    // Layout options
    layoutVertical: 'Diseño Vertical',
    layoutHorizontal: 'Diseño Horizontal',
    layoutCompact: 'Diseño Compacto',
    layoutFullscreen: 'Diseño Pantalla Completa'
  }
};

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('pt-BR');

  useEffect(() => {
    // Try to load saved language from localStorage
    const savedLanguage = localStorage.getItem('camasso-language');
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language;
      if (browserLang.startsWith('pt')) {
        setLanguageState('pt-BR');
      } else if (browserLang.startsWith('es')) {
        setLanguageState('es');
      } else {
        setLanguageState('en-US');
      }
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('camasso-language', lang);
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language as keyof typeof translations] || translations['en-US'];
    return currentTranslations[key as keyof typeof currentTranslations] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
