
import React, { useState, useEffect } from "react";
import KioskLayout from "@/components/KioskLayout";
import { useLanguage } from "@/hooks/use-language";
import { Card } from "@/components/ui/card";
import { Brain, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface QueueItem {
  number: string;
  name: string;
  destination: string;
  status: "waiting" | "called" | "attending";
  timestamp: Date;
  estimatedWaitTime?: number; // in minutes
}

const QueuePanel = () => {
  const { t } = useLanguage();
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [lastCalled, setLastCalled] = useState<QueueItem | null>(null);
  const [averageWaitTime, setAverageWaitTime] = useState<number>(12); // Default average wait time in minutes
  const [busyLevel, setBusyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Calculate AI-based wait time estimates
  const calculateWaitTimeEstimate = (position: number, destination: string) => {
    // In a real app, this would use a trained ML model based on:
    // - Historical wait times for this destination
    // - Time of day/week patterns
    // - Current staffing levels
    // - Current queue length and processing speed
    
    // Base wait time per person in queue
    let baseWaitTime = averageWaitTime;
    
    // Adjust based on destination (some departments are faster/slower)
    const destinationFactor = {
      'Coleta': 1.2, // Takes a bit longer
      'Raio-X': 0.8, // Usually faster
      'Consulta': 1.5, // Doctor consultations take longer
      'Exame': 1.0, // Average time
    }[destination] || 1.0;
    
    // Adjust based on busy level
    const busyFactor = {
      'low': 0.7,
      'medium': 1.0,
      'high': 1.8
    }[busyLevel];
    
    // Calculate position-based wait time with our factors
    const estimatedMinutes = Math.round(position * baseWaitTime * destinationFactor * busyFactor);
    
    // Add slight random variation to make it look more realistic
    return Math.max(1, estimatedMinutes + (Math.random() > 0.5 ? 1 : -1));
  };
  
  // Simulate queue data
  useEffect(() => {
    const demoQueue: QueueItem[] = [
      {
        number: "A001",
        name: "Maria Silva",
        destination: "Coleta",
        status: "waiting",
        timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
      },
      {
        number: "A002",
        name: "João Oliveira",
        destination: "Raio-X",
        status: "waiting",
        timestamp: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
      },
      {
        number: "B001",
        name: "Ana Santos",
        destination: "Consulta",
        status: "called",
        timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
      },
      {
        number: "B002",
        name: "Carlos Mendes",
        destination: "Exame",
        status: "waiting",
        timestamp: new Date(Date.now() - 1000 * 60 * 2) // 2 minutes ago
      }
    ];
    
    // Simulate AI analysis of current conditions
    // In a real app, this would come from a real-time analysis of hospital metrics
    const currentHour = new Date().getHours();
    const isWeekend = [0, 6].includes(new Date().getDay());
    
    // Determine busy level based on time of day and week
    let calculatedBusyLevel: 'low' | 'medium' | 'high' = 'medium';
    
    if (isWeekend) {
      if (currentHour >= 9 && currentHour <= 14) {
        calculatedBusyLevel = 'high'; // Weekend mornings are busy
      } else if (currentHour < 7 || currentHour > 20) {
        calculatedBusyLevel = 'low'; // Early/late hours are less busy
      }
    } else {
      // Weekday patterns
      if (currentHour >= 7 && currentHour <= 9) {
        calculatedBusyLevel = 'high'; // Morning rush
      } else if (currentHour >= 16 && currentHour <= 19) {
        calculatedBusyLevel = 'high'; // Evening rush
      } else if (currentHour < 6 || currentHour > 21) {
        calculatedBusyLevel = 'low'; // Night hours
      }
    }
    
    setBusyLevel(calculatedBusyLevel);
    
    // Add wait time estimates to the queue items
    const queueWithEstimates = demoQueue.map((item, index) => {
      if (item.status === "waiting") {
        // Calculate position based on timestamp
        // In a real app, this would be based on actual queue position
        const position = index + 1;
        return {
          ...item,
          estimatedWaitTime: calculateWaitTimeEstimate(position, item.destination)
        };
      }
      return item;
    });
    
    setQueueItems(queueWithEstimates);
    setLastCalled(demoQueue.find(item => item.status === "called") || null);
    
    // Show AI estimation toast
    toast({
      title: t("aiEstimation") || "Estimativa por IA",
      description: busyLevel === 'low' 
        ? (t("lowTrafficMessage") || "Fluxo baixo detectado. Tempos de espera reduzidos.")
        : busyLevel === 'medium'
        ? (t("mediumTrafficMessage") || "Fluxo moderado. Tempos de espera normais.")
        : (t("highTrafficMessage") || "Fluxo alto detectado. Tempos de espera aumentados."),
      duration: 5000,
    });
    
    // Simulate a new call every 30 seconds
    const interval = setInterval(() => {
      const waitingItems = queueWithEstimates.filter(item => item.status === "waiting");
      if (waitingItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * waitingItems.length);
        const newCalled = waitingItems[randomIndex];
        newCalled.status = "called";
        newCalled.timestamp = new Date();
        
        // Recalculate wait times for remaining waiting patients
        const updatedQueue = queueWithEstimates.map((item, idx) => {
          if (item.number === newCalled.number) {
            return newCalled;
          }
          if (item.status === "waiting") {
            // Position decreased because someone was called
            const newPosition = queueWithEstimates.filter(
              qi => qi.status === "waiting" && 
              qi.timestamp < item.timestamp
            ).length;
            return {
              ...item,
              estimatedWaitTime: calculateWaitTimeEstimate(newPosition + 1, item.destination)
            };
          }
          return item;
        });
        
        setLastCalled(newCalled);
        setQueueItems([...updatedQueue]);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getWaitingTime = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return t("lessThanAMinute") || "Menos de um minuto";
    if (diffMinutes === 1) return t("oneMinute") || "1 minuto atrás";
    return (t("minutesAgo") || "{minutes} minutos atrás").replace("{minutes}", diffMinutes.toString());
  };
  
  // Format estimated time in friendly terms
  const formatEstimatedTime = (minutes: number) => {
    if (!minutes && minutes !== 0) return "-";
    
    if (minutes < 5) return t("lessThanFiveMinutes") || "Menos de 5 minutos";
    if (minutes < 10) return t("lessThanTenMinutes") || "Menos de 10 minutos";
    
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      if (remainingMinutes === 0) {
        return hours === 1 
          ? (t("aboutOneHour") || "Aproximadamente 1 hora") 
          : (t("aboutHours") || "Aproximadamente {hours} horas").replace("{hours}", hours.toString());
      }
      return (t("aboutHoursAndMinutes") || "Aprox. {hours}h e {minutes}min")
        .replace("{hours}", hours.toString())
        .replace("{minutes}", remainingMinutes.toString());
    }
    
    return (t("aboutMinutes") || "Aproximadamente {minutes} minutos").replace("{minutes}", minutes.toString());
  };
  
  // Translation helper for busy level
  const getBusyLevelText = () => {
    switch(busyLevel) {
      case 'low':
        return t("currentlyNotBusy") || "Pouco movimento no momento";
      case 'medium':
        return t("moderatelyBusy") || "Movimento moderado";
      case 'high':
        return t("veryBusy") || "Alto movimento";
      default:
        return t("moderatelyBusy") || "Movimento moderado";
    }
  };
  
  // Get color for busy level indicator
  const getBusyLevelColor = () => {
    switch(busyLevel) {
      case 'low':
        return "#10b981"; // green
      case 'medium':
        return "#f59e0b"; // amber
      case 'high':
        return "#ef4444"; // red
      default:
        return "#f59e0b";
    }
  };
  
  // Get color for estimated wait time
  const getWaitTimeColor = (minutes?: number) => {
    if (!minutes && minutes !== 0) return "";
    
    if (minutes > 30) return "text-red-500";
    if (minutes > 15) return "text-amber-500";
    return "text-green-500";
  };
  
  return (
    <KioskLayout className="bg-gray-100">
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 gap-8">
          {/* Header with logo and title */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">{t("queuePanelTitle") || "Fila de Atendimento"}</h1>
            <p className="text-xl text-gray-600">{t("queuePanelSubtitle") || "Aguarde seu número ser chamado"}</p>
          </div>
          
          {/* AI Wait Time Estimation Card */}
          <Card className="p-6 border-l-4 border-kiosk-blue">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 mr-2 text-kiosk-blue" />
              <h2 className="text-xl font-semibold">{t("aiWaitTimeEstimation") || "Estimativa de Tempo por IA"}</h2>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getBusyLevelColor() }}
              ></div>
              <span className="text-sm">{getBusyLevelText()}</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {t("waitTimeDisclaimer") || "As estimativas são baseadas em padrões históricos e podem variar."}
            </p>
          </Card>
          
          {/* Last called patient */}
          {lastCalled && (
            <div className="animate-pulse-slow">
              <div className="bg-kiosk-blue text-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">{t("nowCalling") || "CHAMANDO AGORA"}</h2>
                  <div className="flex items-center justify-center">
                    <div className="text-5xl md:text-7xl font-bold mr-4">{lastCalled.number}</div>
                    <div className="text-left">
                      <p className="text-2xl md:text-3xl font-medium">{lastCalled.name}</p>
                      <p className="text-xl md:text-2xl">{lastCalled.destination}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Queue table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("queueNumber") || "Senha"}</TableHead>
                  <TableHead>{t("name") || "Nome"}</TableHead>
                  <TableHead>{t("destination") || "Destino"}</TableHead>
                  <TableHead>{t("waitingSince") || "Aguardando desde"}</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {t("estimatedWaitTime") || "Tempo estimado de espera"}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queueItems
                  .filter(item => item.status === "waiting")
                  .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                  .map((item) => (
                    <TableRow key={item.number}>
                      <TableCell className="font-medium">{item.number}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.destination}</TableCell>
                      <TableCell>{getWaitingTime(item.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={getWaitTimeColor(item.estimatedWaitTime)}>
                            {formatEstimatedTime(item.estimatedWaitTime || 0)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Fallback if table is empty */}
          {queueItems.filter(item => item.status === "waiting").length === 0 && (
            <div className="text-center p-8 bg-white rounded-lg">
              <p className="text-gray-500">{t("noWaitingPatients") || "Não há pacientes aguardando no momento"}</p>
            </div>
          )}
        </div>
      </div>
    </KioskLayout>
  );
};

export default QueuePanel;
