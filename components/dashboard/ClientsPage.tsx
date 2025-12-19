import React, { useState, useEffect } from 'react';
import {
  UserPlus, Search, Mail, Phone, ExternalLink, Edit2,
  Shield, MapPin, ChevronRight, MessageSquare,
  Calendar, MoreVertical, Star, UserCheck, Smartphone, Sparkles, User
} from 'lucide-react';
import { Client } from '../../types';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { officeId } = useAuth();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const mappedData: Client[] = data.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email || '',
        phone: c.phone || '',
        type: c.type as any,
        status: c.status as any,
        activeCases: c.active_cases || 0,
        address: c.address || '',
        interactions: []
      }));
      setClients(mappedData);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const clientData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      office_id: officeId,
      status: 'Active',
      type: 'Individual'
    };

    if (editingClient) {
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', editingClient.id);

      if (!error) {
        setEditingClient(null);
        fetchClients();
      }
    } else {
      const { error } = await supabase
        .from('clients')
        .insert([clientData]);

      if (!error) {
        setIsCreateModalOpen(false);
        fetchClients();
      }
    }
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toString().includes(searchTerm)
  );

  const handleOpenDetail = (client: Client) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const handleEdit = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClient(client);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none italic font-serif gold-gradient-text">Fidelização Alpha.</h1>
          <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-[0.4em]">Gestão Estratégica de Relacionamento Master</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <UserPlus size={18} /> Novo Cliente Alpha
        </button>
      </div>

      <div className="premium-card p-6 rounded-[2.5rem] flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-4.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-16 pr-6 py-4.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-3xl outline-none text-slate-950 dark:text-white font-black text-sm transition-all shadow-inner"
            placeholder="Buscar por Nome, Email ou ID Master..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => handleOpenDetail(client)}
            className="premium-card p-10 rounded-[3rem] group cursor-pointer hover:border-gold-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-900 text-slate-300 dark:text-zinc-700 rounded-[2.2rem] flex items-center justify-center font-black text-2xl border border-slate-100 dark:border-zinc-800 shadow-xl group-hover:bg-gold-600 group-hover:text-black group-hover:border-gold-500 transition-all">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white tracking-tight leading-none group-hover:gold-gradient-text transition-all">{client.name}</h3>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-zinc-600">ID: ALPHA-{client.id}</span>
                    <Star size={12} className="text-gold-500 fill-gold-500 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => handleEdit(client, e)} className="p-2.5 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-400 hover:text-gold-500 transition-all"><Edit2 size={16} /></button>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-zinc-500">
                <Mail size={16} className="text-gold-600 shrink-0" /> <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-zinc-500">
                <Smartphone size={16} className="text-gold-600 shrink-0" /> {client.phone}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest mb-2">Compliance Alpha</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                  <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-tighter">Status: {client.status}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-[1.5rem] bg-slate-100 dark:bg-zinc-950 flex items-center justify-center text-slate-400 group-hover:bg-gold-600 group-hover:text-black transition-all shadow-xl">
                <ChevronRight size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isCreateModalOpen || !!editingClient}
        onClose={() => { setIsCreateModalOpen(false); setEditingClient(null); }}
        title={editingClient ? "Atualizar Perfil Master" : "Registrar Novo Cliente Alpha"}
      >
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Denominação Jurídica</label>
            <input name="name" defaultValue={editingClient?.name} required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Nome Completo ou Razão Social" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Email Master</label>
              <input name="email" defaultValue={editingClient?.email} required type="email" className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="exemplo@alpha.com" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Canal de Contato (Fone)</label>
              <input name="phone" defaultValue={editingClient?.phone} required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="(00) 00000-0000" />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Localização Alpha (Endereço)</label>
            <input name="address" defaultValue={editingClient?.address} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Rua, Número, Bairro, Cidade/UF" />
          </div>
          <div className="pt-8 flex flex-col sm:flex-row gap-6 border-t border-slate-100 dark:border-zinc-900">
            <button type="button" onClick={() => { setIsCreateModalOpen(false); setEditingClient(null); }} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-all">Cancelar</button>
            <button type="submit" className="flex-[2] py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all">
              {editingClient ? "Efetivar Governança" : "Confirmar Cliente Alpha"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Master Dossiê • Relacionamento Alpha">
        {selectedClient && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gold-500 rounded-[4rem] blur-3xl opacity-10" />
                <div className="relative h-40 w-40 bg-slate-50 dark:bg-zinc-900 rounded-[4rem] flex items-center justify-center text-slate-950 dark:text-white text-6xl font-black shadow-3xl border border-slate-200 dark:border-zinc-800">
                  {selectedClient.name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gold-600 p-4 rounded-3xl text-black shadow-2xl border-4 border-white dark:border-zinc-950">
                  <UserCheck size={24} />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-6">
                <h2 className="text-4xl font-black text-slate-950 dark:text-white tracking-tighter leading-none italic font-serif gold-gradient-text">{selectedClient.name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div className="bg-emerald-500/10 text-emerald-600 px-6 py-2.5 rounded-2xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm">
                    <Shield size={14} /> Compliance: Verificado
                  </div>
                  <div className="bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-600 px-6 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest">
                    ID: ALPHA-{selectedClient.id}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 dark:bg-zinc-900 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest flex items-center gap-3"><MapPin size={18} className="text-gold-600" /> Sede / Residência</h4>
                <p className="text-sm font-bold text-slate-600 dark:text-zinc-400 leading-relaxed italic">{selectedClient.address}</p>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-zinc-900 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 flex flex-col justify-center">
                <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest mb-1">Litígios em Curso</span>
                <p className="text-4xl font-black text-slate-950 dark:text-white tracking-tighter">{selectedClient.activeCases}</p>
              </div>
            </div>
            <div className="pt-10 border-t border-slate-100 dark:border-zinc-900">
              <button onClick={() => setIsDetailOpen(false)} className="w-full py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-2xl transition-all active:scale-95">Encerrar Dossiê Alpha</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
