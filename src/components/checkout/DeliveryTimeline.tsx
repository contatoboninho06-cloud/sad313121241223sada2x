import { useEffect, useState } from 'react';
import { Check, ChefHat, Bike, Home, Clock } from 'lucide-react';
import { generateDeliveryTime, type AssignedDriver } from './driverData';

interface DeliveryTimelineProps {
  driver: AssignedDriver;
  onComplete: () => void;
}

interface TimelineStep {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'pending';
}

export default function DeliveryTimeline({ driver, onComplete }: DeliveryTimelineProps) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [times] = useState(() => generateDeliveryTime(driver.avgTime));

  const steps: TimelineStep[] = [
    {
      icon: <Check className="w-4 h-4" />,
      title: 'Pedido confirmado',
      subtitle: 'Seu pedido foi recebido',
      status: 'completed',
    },
    {
      icon: <ChefHat className="w-4 h-4" />,
      title: 'Em preparação',
      subtitle: 'A cozinha está preparando seu pedido',
      status: 'active',
    },
    {
      icon: <Bike className="w-4 h-4" />,
      title: `Saída prevista: ${times.departure}`,
      subtitle: `${driver.name} parceiro iFood irá buscar`,
      status: 'pending',
    },
    {
      icon: <Home className="w-4 h-4" />,
      title: `Entrega estimada: ${times.arrival}`,
      subtitle: 'Receba em seu endereço',
      status: 'pending',
    },
  ];

  useEffect(() => {
    // Animate steps appearing one by one
    const timers = steps.map((_, index) => 
      setTimeout(() => setVisibleSteps(index + 1), 300 + index * 400)
    );

    // Auto-complete after showing all steps - extended to 1200ms for better reading
    const completeTimer = setTimeout(onComplete, 300 + steps.length * 400 + 1200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const getStatusStyles = (status: TimelineStep['status'], isVisible: boolean) => {
    if (!isVisible) return 'opacity-0 translate-x-4';
    
    switch (status) {
      case 'completed':
        return 'opacity-100 translate-x-0';
      case 'active':
        return 'opacity-100 translate-x-0';
      case 'pending':
        return 'opacity-100 translate-x-0';
      default:
        return 'opacity-100 translate-x-0';
    }
  };

  const getIconBg = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'active':
        return 'bg-primary text-primary-foreground animate-pulse';
      case 'pending':
        return 'bg-muted text-muted-foreground';
    }
  };

  const getLineBg = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-gradient-to-b from-green-500 to-muted';
      case 'pending':
        return 'bg-muted';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      {/* Header */}
      <div 
        className={`text-center mb-8 transform transition-all duration-500 ${
          visibleSteps > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Preparação iniciada!
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Acompanhe o progresso do seu pedido
        </p>
      </div>

      {/* Timeline */}
      <div className="w-full max-w-sm space-y-0">
        {steps.map((step, index) => {
          const isVisible = index < visibleSteps;
          const isLast = index === steps.length - 1;

          return (
            <div 
              key={index}
              className={`relative flex items-start gap-4 transform transition-all duration-500 ${
                getStatusStyles(step.status, isVisible)
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon and line */}
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300 ${
                    getIconBg(step.status)
                  }`}
                >
                  {step.icon}
                </div>
                {!isLast && (
                  <div 
                    className={`w-0.5 h-12 transition-colors duration-300 ${
                      getLineBg(step.status)
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <h3 
                  className={`font-semibold transition-colors duration-300 ${
                    step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer message */}
      <div 
        className={`mt-4 text-center transform transition-all duration-500 ${
          visibleSteps >= steps.length ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <p className="text-sm text-muted-foreground">
          Finalize o pagamento para confirmar
        </p>
      </div>
    </div>
  );
}
