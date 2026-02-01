
'use client'
// SIGN UP PASSWORD STRENGTH CHECKER

type Strength = "weak" | "medium" | "strong";

export function getPasswordStrength(password: string): Strength {
  if (password.length < 6) return "weak";
  if (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  )
    return "strong";
  return "medium";
}



import { motion } from "framer-motion";

export function PasswordStrengthMeter({ password }: { password: string }) {
  
  const strength = getPasswordStrength(password);
  const strengthMap = {
    weak: { width: "33%", color: "bg-red-500" },
    medium: { width: "66%", color: "bg-yellow-500" },
    strong: { width: "100%", color: "bg-green-500" },
  };

  return (
    <div className="space-y-2">
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full ${strengthMap[strength].color}`}
          animate={{ width: strengthMap[strength].width }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Password strength:{" "}
        <span className="capitalize font-medium">{strength}</span>
      </p>
    </div>
  );
}


// 1. Regex Email Checker
export function isValidEmail(email: string): boolean {
  // Simple, robust email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 2. Visual Component (Like your Password Meter)
import { Check, X, Loader2 } from "lucide-react";


export function EmailStatusIndicator({ 
  isValid, 
  isChecking, 
  isTaken,
  error,
}: { 
  isValid: boolean; 
  isChecking: boolean; 
  isTaken: boolean | null;
  error: string ;
}) {
  if (!isValid) return null; // Don't show anything if format is invalid yet

  let ErrorB4FirstPeriod;

  const firstPeriodIndex = error?.indexOf('.');
  if (firstPeriodIndex !== -1) {
   ErrorB4FirstPeriod = error?.slice(0, firstPeriodIndex);

}

  return (
    <div className="translate-y-1/2 flex items-center">
      {isChecking ? (
        <Loader2 className="animate-spin text-muted-foreground" size={16} />
      ) : isTaken ? (
        <div className="flex items-center gap-1 text-destructive text-xs font-medium 
        bg-background px-1">
          <X size={14} /> Email Taken
        </div>
      ) :  error ? (
        <div className="flex items-center gap-1 text-destructive text-xs font-medium 
        bg-background px-1">
          <X size={14} /> {ErrorB4FirstPeriod}
        </div>
      ): (
        <Check className="text-green-500" size={16} />
      )}
    </div>
  );
}