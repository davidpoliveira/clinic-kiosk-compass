
import React from "react";
import { cn } from "@/lib/utils";

interface KioskLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const KioskLayout: React.FC<KioskLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col bg-white text-kiosk-text font-sans",
      className
    )}>
      {/* Header */}
      <header className="bg-kiosk-blue p-4 md:p-6 shadow-md">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-kiosk-blue h-8 w-8 md:h-10 md:w-10"
              >
                <path d="M8 9h8"></path>
                <path d="M8 13h6"></path>
                <path d="M18 4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12z"></path>
              </svg>
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-white">ClinicKiosk</h1>
          </div>
          <div className="text-white text-sm md:text-base">
            <p className="font-medium">{new Date().toLocaleDateString()}</p>
            <p>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
          <p>© 2025 ClinicKiosk Self-Service System</p>
        </div>
      </footer>
    </div>
  );
};

export default KioskLayout;
