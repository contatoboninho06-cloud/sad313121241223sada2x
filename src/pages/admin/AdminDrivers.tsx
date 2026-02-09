import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Bike, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DriverPhoto {
  id: string;
  name: string;
  photo_url: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminDrivers() {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverPhoto | null>(null);
  const [deleteDriver, setDeleteDriver] = useState<DriverPhoto | null>(null);
  const [formData, setFormData] = useState({ name: '', photo_url: '' });

  // Fetch drivers
  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ['driver-photos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_photos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DriverPhoto[];
    },
  });

  // Add driver mutation
  const addDriverMutation = useMutation({
    mutationFn: async (data: { name: string; photo_url: string }) => {
      const { error } = await supabase.from('driver_photos').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-photos'] });
      setIsAddDialogOpen(false);
      setFormData({ name: '', photo_url: '' });
      toast.success('Entregador adicionado!');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar entregador');
      console.error(error);
    },
  });

  // Update driver mutation
  const updateDriverMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; photo_url?: string; is_active?: boolean }) => {
      const { error } = await supabase.from('driver_photos').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-photos'] });
      setEditingDriver(null);
      setFormData({ name: '', photo_url: '' });
      toast.success('Entregador atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar entregador');
      console.error(error);
    },
  });

  // Delete driver mutation
  const deleteDriverMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('driver_photos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-photos'] });
      setDeleteDriver(null);
      toast.success('Entregador removido!');
    },
    onError: (error) => {
      toast.error('Erro ao remover entregador');
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.photo_url.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (editingDriver) {
      updateDriverMutation.mutate({ id: editingDriver.id, ...formData });
    } else {
      addDriverMutation.mutate(formData);
    }
  };

  const handleEdit = (driver: DriverPhoto) => {
    setEditingDriver(driver);
    setFormData({ name: driver.name, photo_url: driver.photo_url });
  };

  const handleToggleActive = (driver: DriverPhoto) => {
    updateDriverMutation.mutate({ id: driver.id, is_active: !driver.is_active });
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingDriver(null);
    setFormData({ name: '', photo_url: '' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Entregadores iFood</h1>
            <p className="text-muted-foreground">
              Gerencie as fotos dos entregadores exibidas no checkout
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Entregador
          </Button>
        </div>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                <Bike className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Dica:</strong> Adicione fotos reais de entregadores para aumentar a confiança do cliente.
                  Se não houver entregadores cadastrados, o sistema usará fotos genéricas automaticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drivers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-3" />
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : drivers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nenhum entregador cadastrado</h3>
              <p className="text-muted-foreground mb-4">
                O sistema está usando fotos genéricas. Adicione fotos reais para melhorar a conversão.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Entregador
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {drivers.map((driver) => (
              <Card key={driver.id} className={!driver.is_active ? 'opacity-60' : ''}>
                <CardContent className="p-4 text-center">
                  <div className="relative inline-block mb-3">
                    <Avatar className="w-20 h-20 ring-2 ring-green-100">
                      <AvatarImage src={driver.photo_url} alt={driver.name} />
                      <AvatarFallback className="bg-green-500 text-white text-xl font-bold">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {!driver.is_active && (
                      <Badge variant="secondary" className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground truncate">{driver.name}</h3>
                  
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Switch
                      checked={driver.is_active}
                      onCheckedChange={() => handleToggleActive(driver)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(driver)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteDriver(driver)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isAddDialogOpen || !!editingDriver} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDriver ? 'Editar Entregador' : 'Adicionar Entregador'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Entregador</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: João Silva"
                />
              </div>
              
              <div className="space-y-2">
                <ImageUpload
                  label="Foto do Entregador"
                  value={formData.photo_url}
                  onChange={(url) => setFormData(prev => ({ ...prev, photo_url: url || '' }))}
                  bucket="store-assets"
                  folder="drivers"
                />
              </div>

              {formData.photo_url && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={formData.photo_url} alt={formData.name} />
                    <AvatarFallback className="bg-green-500 text-white">
                      {formData.name.split(' ').map(n => n[0]).join('') || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{formData.name || 'Nome do entregador'}</p>
                    <p className="text-sm text-muted-foreground">Prévia do card</p>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={addDriverMutation.isPending || updateDriverMutation.isPending}
                >
                  {editingDriver ? 'Salvar' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteDriver} onOpenChange={() => setDeleteDriver(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover Entregador</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover <strong>{deleteDriver?.name}</strong>? 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteDriver && deleteDriverMutation.mutate(deleteDriver.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
