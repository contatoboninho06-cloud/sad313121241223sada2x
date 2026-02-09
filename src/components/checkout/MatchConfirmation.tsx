import { useEffect, useState } from 'react';
import { Check, Bike, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { AssignedDriver } from './driverData';
import ifoodLogo from '@/assets/ifood-logo.jpg';

interface MatchConfirmationProps {
  driver: AssignedDriver;
  onComplete: () => void;
}

export default function MatchConfirmation({ driver, onComplete }: MatchConfirmationProps) {
  const [phase, setPhase] = useState(0);
  // phase 0: initial, 1: icons appear, 2: connection line, 3: checkmark, 4: text

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2000),
      setTimeout(onComplete, 3000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-8">
      {/* Connection animation */}
      <div className="relative flex items-center justify-center gap-8">
        {/* Customer icon */}
        <div 
          className={`relative transform transition-all duration-500 ${
            phase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <User className="w-10 h-10 text-white" />
          </div>
          <div 
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground transition-opacity duration-300 ${
              phase >= 4 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Você
          </div>
        </div>

        {/* Connection line */}
        <div className="relative w-16 h-1">
          <div 
            className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ${
              phase >= 2 ? 'scale-x-100' : 'scale-x-0'
            }`}
            style={{ transformOrigin: 'left' }}
          />
          
          {/* Central checkmark */}
          <div 
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-500 ${
              phase >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40 animate-match-pop">
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Driver icon */}
        <div 
          className={`relative transform transition-all duration-500 ${
            phase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          <Avatar className="w-20 h-20 ring-4 ring-green-500/30 shadow-lg shadow-green-500/20">
            <AvatarImage src={driver.photo} alt={driver.name} />
            <AvatarFallback className="bg-green-500 text-white text-xl font-bold">
              {driver.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <Bike className="w-3 h-3 text-white" />
          </div>
          <div 
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground transition-opacity duration-300 whitespace-nowrap ${
              phase >= 4 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {driver.name.split(' ')[0]}
          </div>
        </div>
      </div>

      {/* Success text */}
      <div 
        className={`text-center space-y-2 transform transition-all duration-500 ${
          phase >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500">
            <Check className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Match confirmado!
          </h2>
        </div>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <img src={ifoodLogo} className="w-5 h-5 rounded" alt="iFood" />
          <span><span className="font-semibold text-foreground">{driver.name}</span> parceiro iFood reservado</span>
        </div>
      </div>

      {/* Decorative particles */}
      {phase >= 3 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-green-400 animate-particle"
              style={{
                left: `${45 + Math.random() * 10}%`,
                top: `${35 + Math.random() * 10}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.6 + Math.random() * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
