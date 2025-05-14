
import React, { useState, useEffect } from "react";
import KioskLayout from "@/components/KioskLayout";
import { useLanguage } from "@/hooks/use-language";
import { Card } from "@/components/ui/card";

interface QueueItem {
  number: string;
  name: string;
  destination: string;
  status: "waiting" | "called" | "attending";
  timestamp: Date;
}

const QueuePanel = () => {
  const { t } = useLanguage();
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [lastCalled, setLastCalled] = useState<QueueItem | null>(null);
  
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
    
    setQueueItems(demoQueue);
    setLastCalled(demoQueue.find(item => item.status === "called") || null);
    
    // Simulate a new call every 30 seconds
    const interval = setInterval(() => {
      const waitingItems = demoQueue.filter(item => item.status === "waiting");
      if (waitingItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * waitingItems.length);
        const newCalled = waitingItems[randomIndex];
        newCalled.status = "called";
        newCalled.timestamp = new Date();
        
        setLastCalled(newCalled);
        setQueueItems([...demoQueue]);
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
  
  return (
    <KioskLayout className="bg-gray-100">
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 gap-8">
          {/* Header with logo and title */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">{t("queuePanelTitle")}</h1>
            <p className="text-xl text-gray-600">{t("queuePanelSubtitle")}</p>
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
          
          {/* Queue grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queueItems
              .filter(item => item.status === "waiting")
              .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
              .map((item) => (
                <Card key={item.number} className="bg-white p-4 shadow">
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center mr-4">
                      <span className="text-lg font-bold">{item.number}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.destination}</p>
                      <p className="text-xs text-gray-400">{getWaitingTime(item.timestamp)}</p>
                    </div>
                  </div>
                </Card>
            ))}
          </div>
        </div>
      </div>
    </KioskLayout>
  );
};

export default QueuePanel;
