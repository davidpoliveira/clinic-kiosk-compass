
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CPFInputProps {
  onComplete: () => void;
}

const CPFInput: React.FC<CPFInputProps> = ({ onComplete }) => {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCPF = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    
    // Format as CPF: XXX.XXX.XXX-XX
    if (numericValue.length <= 3) {
      return numericValue;
    } else if (numericValue.length <= 6) {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
    } else if (numericValue.length <= 9) {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6)}`;
    } else {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    setCpf(formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - CPF should have 11 digits
    const numericCPF = cpf.replace(/\D/g, "");
    if (numericCPF.length !== 11) {
      toast({
        variant: "destructive",
        title: "Invalid CPF",
        description: "Please enter a valid CPF number",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "CPF Verified",
        description: "Your identity has been confirmed",
      });
      onComplete();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div className="space-y-2">
        <label htmlFor="cpf" className="block text-lg font-medium">
          Enter your CPF:
        </label>
        <Input
          id="cpf"
          type="text"
          value={cpf}
          onChange={handleChange}
          className="text-xl py-6 text-center"
          placeholder="000.000.000-00"
          maxLength={14}
          disabled={loading}
          autoFocus
        />
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-kiosk-blue hover:bg-kiosk-darkblue text-white text-lg py-6"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Continue"}
        </Button>
      </div>
      
      <div className="text-sm text-gray-500 text-center">
        <p>Your CPF is required to identify your medical records</p>
      </div>
    </form>
  );
};

export default CPFInput;
