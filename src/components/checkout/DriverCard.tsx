import { useEffect, useState } from 'react';
import { Star, MapPin, Bike, Clock, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { AssignedDriver } from './driverData';
import ifoodLogo from '@/assets/ifood-logo.jpg';

interface DriverCardProps {
  driver: AssignedDriver;
  onComplete: () => void;
}

export default function DriverCard({ driver, onComplete }: DriverCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto-advance after 4 seconds for user to read details
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-6">
      {/* Found badge */}
      <div 
        className={`transform transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
      >
        <Badge className="bg-green-500 hover:bg-green-500 text-white px-4 py-1.5 text-sm font-medium shadow-lg">
          <img src={ifoodLogo} className="w-4 h-4 rounded mr-2" alt="iFood" />
          Entregador iFood encontrado!
        </Badge>
      </div>

      {/* Driver card */}
      <Card 
        className={`w-full max-w-sm border-0 shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-700 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="h-1.5 bg-gradient-to-r from-green-500 via-green-400 to-emerald-500" />
        
        <CardContent className="p-6">
          {/* Driver header */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <Avatar className="w-16 h-16 ring-4 ring-green-100 shadow-md">
                <AvatarImage src={driver.photo} alt={driver.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">{driver.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">{driver.rating}</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  ({driver.deliveries} entregas)
                </span>
              </div>
            </div>
          </div>

          {/* Driver details */}
          <div className="space-y-3">
            {/* Vehicle */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bike className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Veículo</p>
                <p className="font-medium text-foreground">{driver.vehicle}</p>
              </div>
            </div>

            {/* Distance */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Distância até você</p>
                <p className="font-medium text-foreground">{driver.distance}km</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Localização atual</p>
                <p className="font-medium text-foreground truncate">{driver.location}</p>
              </div>
            </div>

            {/* Average time */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tempo médio de entrega</p>
                <p className="font-medium text-foreground">{driver.avgTime} min</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator */}
      <p className="text-sm text-muted-foreground animate-pulse">
        Confirmando disponibilidade...
      </p>
    </div>
  );
}
