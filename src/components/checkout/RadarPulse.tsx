import { useEffect, useState } from 'react';
import { Bike } from 'lucide-react';
import { getOnlineDriversCount } from './driverData';
import ifoodLogo from '@/assets/ifood-logo.jpg';

interface RadarPulseProps {
  onComplete: () => void;
}

export default function RadarPulse({ onComplete }: RadarPulseProps) {
  const [progress, setProgress] = useState(0);
  const [onlineDrivers] = useState(() => getOnlineDriversCount());
  const [searchRadius, setSearchRadius] = useState(1);

  useEffect(() => {
    // Progress animation over 5 seconds for more realistic search
    const duration = 5000;
    const interval = 50;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    // Expand search radius animation
    const radiusTimer = setInterval(() => {
      setSearchRadius(prev => (prev >= 5 ? 5 : prev + 0.5));
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(radiusTimer);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-8">
      {/* iFood branding */}
      <div className="flex items-center justify-center gap-2">
        <img src={ifoodLogo} className="w-6 h-6 rounded" alt="iFood" />
        <span className="text-xs text-muted-foreground font-medium">Parceiro iFood</span>
      </div>

      {/* Radar Animation */}
      <div className="relative w-64 h-64">
        {/* Background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full rounded-full border border-primary/10" />
        </div>
        <div className="absolute inset-4 flex items-center justify-center">
          <div className="w-full h-full rounded-full border border-primary/15" />
        </div>
        <div className="absolute inset-8 flex items-center justify-center">
          <div className="w-full h-full rounded-full border border-primary/20" />
        </div>
        <div className="absolute inset-12 flex items-center justify-center">
          <div className="w-full h-full rounded-full border border-primary/25" />
        </div>

        {/* Animated pulse circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/80 animate-radar-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center" style={{ animationDelay: '0.5s' }}>
          <div className="w-12 h-12 rounded-full bg-primary/60 animate-radar-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/40 animate-radar-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
            <Bike className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        {/* Floating motorcycle icons */}
        <div className="absolute top-4 left-1/4 animate-float-moto" style={{ animationDelay: '0.2s' }}>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shadow-md">
            <Bike className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div className="absolute top-1/4 right-4 animate-float-moto" style={{ animationDelay: '0.7s' }}>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shadow-md">
            <Bike className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div className="absolute bottom-1/4 left-2 animate-float-moto" style={{ animationDelay: '1.2s' }}>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shadow-md">
            <Bike className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div className="absolute bottom-8 right-1/4 animate-float-moto" style={{ animationDelay: '0.5s' }}>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shadow-md">
            <Bike className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="text-center space-y-3">
        <h2 className="text-xl font-bold text-foreground">
          Localizando entregadores próximos...
        </h2>
        <p className="text-muted-foreground">
          Buscando em raio de <span className="font-semibold text-primary">{searchRadius.toFixed(1)}km</span>
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span><span className="font-semibold text-foreground">{onlineDrivers}</span> entregadores online</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs space-y-2">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Analisando disponibilidade...
        </p>
      </div>
    </div>
  );
}
