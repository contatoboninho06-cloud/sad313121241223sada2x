-- Tabela para fotos de entregadores gerenciadas pelo admin
CREATE TABLE public.driver_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.driver_photos ENABLE ROW LEVEL SECURITY;

-- Política pública para leitura de fotos ativas (usado no checkout)
CREATE POLICY "Anyone can view active driver photos"
ON public.driver_photos
FOR SELECT
USING (is_active = true);

-- Política para admins gerenciarem fotos
CREATE POLICY "Admins can manage driver photos"
ON public.driver_photos
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));