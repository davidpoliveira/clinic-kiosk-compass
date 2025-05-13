
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface KioskLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const KioskLayout: React.FC<KioskLayoutProps> = ({ children, className }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col bg-white text-kiosk-text font-sans",
      className
    )}>
      {/* Header */}
      <header className="bg-white border-b p-4 md:p-5 shadow-md">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/14ba4491-7b43-422f-a3ef-19ebb3a523e8.png" 
              alt="Camasso Logo" 
              className="h-10 md:h-12"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[120px] bg-white border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder={t("language")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português</SelectItem>
                  <SelectItem value="en-US">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-gray-700 text-sm md:text-base">
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
              <p>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6 md:py-10 px-4 md:px-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500">
        <div className="container">
          <p>© 2025 Camasso {t("kioskSystem")}</p>
        </div>
      </footer>
    </div>
  );
};

export default KioskLayout;
