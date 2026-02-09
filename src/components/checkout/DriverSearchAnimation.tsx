import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RadarPulse from './RadarPulse';
import DriverCard from './DriverCard';
import MatchConfirmation from './MatchConfirmation';
import DeliveryTimeline from './DeliveryTimeline';
import { generateRandomDriver, type AssignedDriver } from './driverData';

type Phase = 'searching' | 'found' | 'match' | 'timeline';

interface DriverSearchAnimationProps {
  customerZip: string;
  onComplete: (driver: AssignedDriver) => void;
}

export default function DriverSearchAnimation({ customerZip, onComplete }: DriverSearchAnimationProps) {
  const [phase, setPhase] = useState<Phase>('searching');
  const [driver, setDriver] = useState<AssignedDriver | null>(null);

  useEffect(() => {
    // Generate driver data on mount (now async)
    const loadDriver = async () => {
      const generatedDriver = await generateRandomDriver(customerZip);
      setDriver(generatedDriver);
    };
    loadDriver();
  }, [customerZip]);

  const handlePhaseComplete = (currentPhase: Phase) => {
    switch (currentPhase) {
      case 'searching':
        setPhase('found');
        break;
      case 'found':
        setPhase('match');
        break;
      case 'match':
        setPhase('timeline');
        break;
      case 'timeline':
        if (driver) {
          onComplete(driver);
        }
        break;
    }
  };

  if (!driver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary to-primary/60" />
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl rounded-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary via-green-500 to-emerald-500" />
        <CardContent className="p-0">
          {phase === 'searching' && (
            <RadarPulse onComplete={() => handlePhaseComplete('searching')} />
          )}
          {phase === 'found' && (
            <DriverCard driver={driver} onComplete={() => handlePhaseComplete('found')} />
          )}
          {phase === 'match' && (
            <MatchConfirmation driver={driver} onComplete={() => handlePhaseComplete('match')} />
          )}
          {phase === 'timeline' && (
            <DeliveryTimeline driver={driver} onComplete={() => handlePhaseComplete('timeline')} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
