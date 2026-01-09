import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { Process, Client } from '../../types';
import { logAudit } from '../../lib/utils/audit';
import toast from 'react-hot-toast';

import { ProcessHeader } from './processes/ProcessHeader';
import { ProcessList } from './processes/ProcessList';
import { ProcessDetailsModal } from './processes/ProcessDetailsModal';
import { ProcessFormModal } from './processes/ProcessFormModal';
import { ProcessFilterModal } from './processes/ProcessFilterModal';

export const ProcessesPage: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const { officeId } = useAuth();

  useEffect(() => {
    fetchProcesses();
    fetchClients();
  }, [officeId]);

  const fetchClients = async () => {
    const { data } = await supabase.from('clients').select('id, name');
    if (data) setClients(data as any);
  };

  const fetchProcesses = async () => {
    if (!officeId) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase
        .from('processes')
        .select(`
          *,
          clients:client_id (
            name
          )
        `)
        .eq('office_id', officeId)
        .order('created_at', { ascending: false }) as any);

      if (error) throw error;

      if (data) {
        const mappedData: Process[] = (data as any[]).map(p => ({
          id: p.id.toString(),
          number: p.process_number,
          title: p.title,
          client: p.clients?.name || 'Cliente não vinculado',
          court: p.court,
          status: p.status as any,
          lastUpdate: p.last_update,
          value: p.value_text,
          updates: []
        }));
        setProcesses(mappedData);
      }
    } catch (err) {
      console.error('Error fetching processes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Você precisa estar logado para realizar esta ação.');
      return;
    }

    const processData = {
      title: formData.get('title') as string,
      process_number: formData.get('number') as string,
      court: formData.get('court') as string || null,
      status: 'active' as const,
      client_id: formData.get('client_id') ? parseInt(formData.get('client_id') as string) : null,
      office_id: officeId,
      value_text: formData.get('value') as string || null,
      last_update: new Date().toISOString(),
    };

    try {
      if (editingProcess) {
        const { error } = await (supabase
          .from('processes')
          .update(processData)
          .eq('id', editingProcess.id) as any);

        if (error) throw error;

        // Audit Log
        if (user && officeId) {
          await logAudit({
            userId: user.id,
            officeId: officeId,
            action: 'UPDATE_PROCESS',
            entityType: 'process',
            entityId: editingProcess.id.toString(),
            oldData: editingProcess,
            newData: processData
          });
        }

        toast.success('Estratégia processual atualizada');
        setEditingProcess(null);
      } else {
        const { data, error } = await (supabase
          .from('processes')
          .insert([processData])
          .select() as any);

        if (error) throw error;

        // Audit Log
        if (user && officeId && (data as any)?.[0]) {
          await logAudit({
            userId: user.id,
            officeId: officeId,
            action: 'INSERT_PROCESS',
            entityType: 'process',
            entityId: (data as any)[0].id.toString(),
            newData: processData
          });
        }

        toast.success('Captação processual efetivada com sucesso');
        setIsAddModalOpen(false);
      }
      fetchProcesses();
    } catch (error: any) {
      console.error('Error submitting process:', error);
      toast.error(`Erro: ${error.message || 'Não foi possível salvar o processo.'}`);
    }
  };

  const filteredProcesses = processes.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !activeFilter || p.status === activeFilter || p.court?.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (p: Process, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProcess(p);
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      <ProcessHeader
        onNewProcess={() => setIsAddModalOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenFilter={() => setIsFilterModalOpen(true)}
        activeFilter={activeFilter}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin shadow-2xl" />
        </div>
      ) : (
        <ProcessList
          processes={filteredProcesses}
          onSelect={setSelectedProcess}
          onEdit={handleEdit}
        />
      )}

      <ProcessDetailsModal
        process={selectedProcess}
        onClose={() => setSelectedProcess(null)}
        onUploadComplete={fetchProcesses}
      />

      <ProcessFormModal
        isOpen={isAddModalOpen || !!editingProcess}
        onClose={() => { setIsAddModalOpen(false); setEditingProcess(null); }}
        onSubmit={handleSubmit}
        editingProcess={editingProcess}
        clients={clients}
      />

      <ProcessFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
    </div>
  );
};
