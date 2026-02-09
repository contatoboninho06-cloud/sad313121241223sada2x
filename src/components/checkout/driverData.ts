import { supabase } from '@/integrations/supabase/client';

// Pool de fotos reais de entregadores (fallback quando não há fotos no banco)
const fallbackDriverPhotos = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1521341957697-b93449760f30?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1548449112-96a38a643324?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=face',
];

// Nomes brasileiros de fallback
const fallbackDriverNames = [
  'João Silva', 'Carlos Santos', 'Marcos Oliveira', 'Lucas Pereira', 'Rafael Costa',
  'Fernando Lima', 'André Souza', 'Bruno Alves', 'Diego Martins', 'Eduardo Rocha',
  'Gabriel Ferreira', 'Henrique Gomes', 'Igor Barbosa', 'Júlio Nascimento', 'Leandro Carvalho',
  'Márcio Ribeiro', 'Nelson Freitas', 'Otávio Mendes', 'Paulo Araújo', 'Ricardo Teixeira',
];

// Locations based on region
const locations = [
  'Centro', 'Próximo ao Shopping', 'Zona Norte', 'Av. Principal',
  'Praça Central', 'Terminal Rodoviário', 'Parque Municipal', 'Zona Sul',
];

// Vehicle types
const vehicles = [
  'Moto Honda CG 160', 'Moto Yamaha Fazer', 'Moto Honda Bros',
  'Moto Yamaha Factor', 'Moto Honda Fan', 'Moto Yamaha XTZ',
];

export interface AssignedDriver {
  name: string;
  photo: string;
  rating: number;
  deliveries: number;
  vehicle: string;
  distance: number;
  location: string;
  avgTime: number;
}

export interface DriverPhoto {
  name: string;
  photo_url: string;
}

// Fetch driver photos from database
export const fetchDriverPhotos = async (): Promise<DriverPhoto[]> => {
  try {
    const { data, error } = await supabase
      .from('driver_photos')
      .select('name, photo_url')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching driver photos:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Failed to fetch driver photos:', err);
    return [];
  }
};

// Generate random driver data - now async to fetch from database
export const generateRandomDriver = async (customerZip: string): Promise<AssignedDriver> => {
  // Try to get photos from database first
  const dbPhotos = await fetchDriverPhotos();
  
  let name: string;
  let photo: string;
  
  if (dbPhotos.length > 0) {
    // Use photo from database
    const selected = dbPhotos[Math.floor(Math.random() * dbPhotos.length)];
    name = selected.name;
    photo = selected.photo_url;
  } else {
    // Fallback to Unsplash photos
    const randomIndex = Math.floor(Math.random() * fallbackDriverPhotos.length);
    name = fallbackDriverNames[randomIndex];
    photo = fallbackDriverPhotos[randomIndex];
  }
  
  return {
    name,
    photo,
    rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
    deliveries: Math.floor(800 + Math.random() * 1500),
    vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
    distance: Number((0.5 + Math.random() * 2.5).toFixed(1)),
    location: locations[Math.floor(Math.random() * locations.length)],
    avgTime: Math.floor(25 + Math.random() * 20),
  };
};

// Get online drivers count for display
export const getOnlineDriversCount = (): number => {
  return Math.floor(8 + Math.random() * 12);
};

// Generate delivery time estimate
export const generateDeliveryTime = (avgMinutes: number): { departure: string; arrival: string } => {
  const now = new Date();
  const departureTime = new Date(now.getTime() + 15 * 60000); // 15 min from now
  const arrivalTime = new Date(departureTime.getTime() + avgMinutes * 60000);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  return {
    departure: formatTime(departureTime),
    arrival: formatTime(arrivalTime),
  };
};
