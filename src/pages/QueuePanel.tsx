
import React, { useState, useEffect } from "react";
import KioskLayout from "@/components/KioskLayout";
import { useLanguage } from "@/hooks/use-language";
import { Card } from "@/components/ui/card";
import { Brain, Clock } from "lucide-react";
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
    
    if (diffMinutes < 1) return t("lessThanAMinute");
    if (diffMinutes === 1) return t("oneMinute");
    return t("minutesAgo").replace("{minutes}", diffMinutes.toString());
  };
  
  // Format estimated time in friendly terms
  const formatEstimatedTime = (minutes: number) => {
    if (!minutes) return "-";
    
    if (minutes < 5) return t("lessThanFiveMinutes");
    if (minutes < 10) return t("lessThanTenMinutes");
    
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      if (remainingMinutes === 0) {
        return hours === 1 ? t("aboutOneHour") : t("aboutHours").replace("{hours}", hours.toString());
      }
      return t("aboutHoursAndMinutes")
        .replace("{hours}", hours.toString())
        .replace("{minutes}", remainingMinutes.toString());
    }
    
    return t("aboutMinutes").replace("{minutes}", minutes.toString());
  };
  
  return (
    <KioskLayout className="bg-gray-100">
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 gap-8">
          {/* Header with logo and title */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">{t("queuePanelTitle")}</h1>
            <p className="text-xl text-gray-600">{t("queuePanelSubtitle")}</p>
          </div>
          
          {/* AI Wait Time Estimation Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-kiosk-blue">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 mr-2 text-kiosk-blue" />
              <h2 className="text-xl font-semibold">{t("aiWaitTimeEstimation")}</h2>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full mr-2"
                style={{ 
                  backgroundColor: busyLevel === 'low' ? '#10b981' : 
                                  busyLevel === 'medium' ? '#f59e0b' : 
                                  '#ef4444'
                }}
              ></div>
              <span className="text-sm">
                {busyLevel === 'low' ? t("currentlyNotBusy") : 
                 busyLevel === 'medium' ? t("moderatelyBusy") : 
                 t("veryBusy")}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {t("waitTimeDisclaimer")}
            </p>
          </div>
          
          {/* Last called patient */}
          {lastCalled && (
            <div className="animate-pulse-slow">
              <div className="bg-kiosk-blue text-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">{t("nowCalling")}</h2>
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
                  <TableHead>{t("queueNumber")}</TableHead>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("destination")}</TableHead>
                  <TableHead>{t("waitingSince")}</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {t("estimatedWaitTime")}
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
                          <span className={
                            item.estimatedWaitTime && item.estimatedWaitTime > 30 
                              ? "text-red-500" 
                              : item.estimatedWaitTime && item.estimatedWaitTime > 15 
                              ? "text-amber-500" 
                              : "text-green-500"
                          }>
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
              <p className="text-gray-500">{t("noWaitingPatients")}</p>
            </div>
          )}
        </div>
      </div>
    </KioskLayout>
  );
};

export default QueuePanel;
