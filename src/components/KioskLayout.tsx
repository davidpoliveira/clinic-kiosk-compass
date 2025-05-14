
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, LayoutIcon } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useIsMobile } from "@/hooks/use-mobile";

export type LayoutType = "vertical" | "horizontal" | "compact" | "fullscreen";

interface KioskLayoutProps {
  children: React.ReactNode;
  className?: string;
  initialLayout?: LayoutType;
  hideLayoutSwitch?: boolean;
}

const KioskLayout: React.FC<KioskLayoutProps> = ({ 
  children, 
  className,
  initialLayout = "vertical",
  hideLayoutSwitch = false
}) => {
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();
  const [layout, setLayout] = useState<LayoutType>(initialLayout);
  
  // Default to vertical layout on mobile
  const effectiveLayout = isMobile ? "vertical" : layout;

  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col bg-white text-kiosk-text font-sans",
      effectiveLayout === "horizontal" && "md:flex-row md:min-h-screen",
      effectiveLayout === "compact" && "max-w-3xl mx-auto shadow-xl my-4 min-h-[calc(100vh-2rem)]",
      effectiveLayout === "fullscreen" && "h-screen overflow-hidden",
      className
    )}>
      {/* Header */}
      <header className={cn(
        "bg-white border-b p-4 md:p-5 shadow-md",
        effectiveLayout === "horizontal" && "md:h-screen md:w-64 md:flex md:flex-col md:border-r md:border-b-0"
      )}>
        <div className={cn(
          "container flex justify-between items-center",
          effectiveLayout === "horizontal" && "md:flex-col md:h-full md:justify-start md:gap-8"
        )}>
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/14ba4491-7b43-422f-a3ef-19ebb3a523e8.png" 
              alt="Camasso Logo" 
              className={cn(
                "h-10 md:h-12",
                effectiveLayout === "horizontal" && "md:h-16"
              )}
            />
          </div>
          
          <div className={cn(
            "flex items-center gap-4",
            effectiveLayout === "horizontal" && "md:flex-col md:items-stretch"
          )}>
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
            
            {!hideLayoutSwitch && !isMobile && (
              <div className="flex items-center mt-2">
                <Select value={layout} onValueChange={(value) => setLayout(value as LayoutType)}>
                  <SelectTrigger className="w-[150px] bg-white border border-gray-200">
                    <div className="flex items-center gap-2">
                      <LayoutIcon className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder={t("layoutVertical")} />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vertical">{t("layoutVertical")}</SelectItem>
                    <SelectItem value="horizontal">{t("layoutHorizontal")}</SelectItem>
                    <SelectItem value="compact">{t("layoutCompact")}</SelectItem>
                    <SelectItem value="fullscreen">{t("layoutFullscreen")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className={cn(
              "text-gray-700 text-sm md:text-base",
              effectiveLayout === "horizontal" && "md:mt-auto"
            )}>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
              <p>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        "flex-1 container py-6 md:py-10 px-4 md:px-6",
        effectiveLayout === "fullscreen" && "p-0 max-w-none",
        effectiveLayout === "horizontal" && "md:overflow-y-auto"
      )}>
        {children}
      </main>

      {/* Footer */}
      <footer className={cn(
        "bg-gray-100 py-4 text-center text-sm text-gray-500",
        effectiveLayout === "horizontal" && "md:hidden"
      )}>
        <div className="container">
          <p>© 2025 Camasso {t("kioskSystem")}</p>
        </div>
      </footer>
    </div>
  );
};

export default KioskLayout;
