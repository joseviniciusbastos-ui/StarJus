import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/AuthContext';
import { logAudit } from '../../lib/utils/audit';
import { Condominium, Unit } from '../../types';
import { supabase } from '../../lib/supabase';

import { CondoHeader } from './condos/CondoHeader';
import { CondoList } from './condos/CondoList';
import { UnitList } from './condos/UnitList';
import { CondoModal } from './condos/CondoModal';
import { UnitModal } from './condos/UnitModal';
import { UnitDetailsModal } from './condos/UnitDetailsModal';

export const CondosPage: React.FC = () => {
  const [condos, setCondos] = useState<Condominium[]>([]);
  const [selectedCondo, setSelectedCondo] = useState<Condominium | null>(null);
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCondoModalOpen, setIsCondoModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isUnitDetailOpen, setIsUnitDetailOpen] = useState(false);
  const [editingCondo, setEditingCondo] = useState<Condominium | null>(null);

  const { officeId } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (officeId) fetchCondos();
  }, [officeId]);

  useEffect(() => {
    if (selectedCondo) {
      fetchUnits(selectedCondo.id);
    }
  }, [selectedCondo]);

  const fetchCondos = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('condominiums')
      .select('*')
      .eq('office_id', officeId) as any);

    if (data) {
      const mapped: Condominium[] = (data as any[]).map(c => ({
        id: c.id.toString(),
        name: c.name,
        cnpj: c.cnpj || '',
        address: c.address || '',
        totalUnits: c.total_units || 0,
        activeProcesses: 0,
        manager: c.manager || ''
      }));
      setCondos(mapped);
    }
    setLoading(false);
  };

  const fetchUnits = async (condoId: string) => {
    const { data, error } = await (supabase.from('units').select('*').eq('condo_id', condoId) as any);
    if (data) {
      const mapped: Unit[] = (data as any[]).map(u => ({
        id: u.id.toString(),
        condoId: u.condo_id.toString(),
        number: u.number,
        block: u.block || '',
        owner: u.owner || '',
        status: u.status as any,
        logs: []
      }));
      setUnits(mapped);
    }
  };

  const handleOpenUnitDetail = (unit: Unit) => {
    setActiveUnit(unit);
    setIsUnitDetailOpen(true);
  };

  const handleEditCondo = (c: Condominium, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCondo(c);
  };

  const handleCreateCondo = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const cnpj = formData.get('cnpj') as string;
    const manager = formData.get('manager') as string;
    const address = formData.get('address') as string;

    setIsSaving(true);
    try {
      const { data, error } = await (supabase
        .from('condominiums')
        .insert([{
          name,
          cnpj,
          manager,
          address,
          office_id: officeId
        }] as any)
        .select() as any);

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (user && officeId) {
        await logAudit({
          userId: user.id,
          officeId,
          action: 'INSERT_CONDO',
          entityType: 'condominium',
          entityId: (data as any)?.[0]?.id.toString(),
          newData: { name, cnpj, manager, address }
        });
      }

      toast.success('Unidade Gestora registrada!');
      fetchCondos();
      setIsCondoModalOpen(false);
    } catch (err) {
      toast.error('Erro ao registrar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCondo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCondo) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const cnpj = formData.get('cnpj') as string;
    const manager = formData.get('manager') as string;
    const address = formData.get('address') as string;

    setIsSaving(true);
    try {
      const { error } = await (supabase
        .from('condominiums')
        .update({
          name,
          cnpj,
          manager,
          address
        } as any)
        .eq('id', editingCondo.id) as any);

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (user && officeId) {
        await logAudit({
          userId: user.id,
          officeId,
          action: 'UPDATE_CONDO',
          entityType: 'condominium',
          entityId: editingCondo.id,
          oldData: editingCondo,
          newData: { name, cnpj, manager, address }
        });
      }

      toast.success('Ativo atualizado.');
      fetchCondos();
      setEditingCondo(null);
    } catch (err) {
      toast.error('Erro ao atualizar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCondo) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const block = formData.get('block') as string;
    const number = formData.get('number') as string;
    const owner = formData.get('owner') as string;

    setIsSaving(true);
    try {
      const { data, error } = await (supabase
        .from('units')
        .insert([{
          condo_id: selectedCondo.id,
          block,
          number,
          owner,
          status: 'Compliant'
        } as any] as any)
        .select() as any);

      if (error) throw error;

      toast.success('Unidade habitacional registrada!');
      fetchUnits(selectedCondo.id);
      setIsUnitModalOpen(false);
    } catch (err) {
      toast.error('Erro ao registrar unidade.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <CondoHeader onRegister={() => setIsCondoModalOpen(true)} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin shadow-2xl" />
        </div>
      ) : (
        <CondoList
          condos={condos}
          selectedCondoId={selectedCondo?.id}
          onSelect={setSelectedCondo}
          onEdit={handleEditCondo}
        />
      )}

      {selectedCondo && (
        <UnitList
          condoName={selectedCondo.name}
          units={units}
          onAddUnit={() => setIsUnitModalOpen(true)}
          onSelectUnit={handleOpenUnitDetail}
        />
      )}

      <CondoModal
        isOpen={isCondoModalOpen || !!editingCondo}
        onClose={() => { setIsCondoModalOpen(false); setEditingCondo(null); }}
        onSubmit={editingCondo ? handleUpdateCondo : handleCreateCondo}
        editingCondo={editingCondo}
        isSaving={isSaving}
      />

      <UnitModal
        isOpen={isUnitModalOpen}
        onClose={() => setIsUnitModalOpen(false)}
        onSubmit={handleCreateUnit}
        isSaving={isSaving}
      />

      <UnitDetailsModal
        unit={activeUnit}
        onClose={() => setIsUnitDetailOpen(false)}
      />
    </div>
  );
};
