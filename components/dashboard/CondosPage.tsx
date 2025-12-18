import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Search, MapPin, History, Trash2, Edit2,
  ChevronRight, LayoutList, FileText, Sparkles, Clock, MoreVertical, Smartphone, User, Hash
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Condominium, Unit } from '../../types';
import { supabase } from '../../lib/supabase';

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

  useEffect(() => {
    fetchCondos();
  }, []);

  useEffect(() => {
    if (selectedCondo) {
      fetchUnits(selectedCondo.id);
    }
  }, [selectedCondo]);

  const fetchCondos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('condominiums').select('*');
    if (data) {
      const mapped: Condominium[] = data.map(c => ({
        id: c.id.toString(),
        name: c.name,
        cnpj: c.cnpj || '',
        address: c.address || '',
        totalUnits: c.total_units || 0,
        activeProcesses: 0, // In a real app we'd join or calculate this
        manager: c.manager || ''
      }));
      setCondos(mapped);
    }
    setLoading(false);
  };

  const fetchUnits = async (condoId: string) => {
    const { data, error } = await supabase.from('units').select('*').eq('condo_id', condoId);
    if (data) {
      const mapped: Unit[] = data.map(u => ({
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

  const condoUnits = units;

  const handleOpenUnitDetail = (unit: Unit) => {
    setActiveUnit(unit);
    setIsUnitDetailOpen(true);
  };

  const handleEditCondo = (c: Condominium, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCondo(c);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white italic font-serif gold-gradient-text leading-none uppercase">Ativos Alpha.</h1>
          <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-[0.4em]">Gestão de Unidades Gestoras & Habitacionais</p>
        </div>
        <button
          onClick={() => setIsCondoModalOpen(true)}
          className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-3xl transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={18} /> Registrar Unidade Gestora
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {condos.map(condo => (
          <div
            key={condo.id}
            onClick={() => setSelectedCondo(condo)}
            className={`premium-card p-10 rounded-[3rem] border transition-all cursor-pointer group hover:shadow-3xl hover:-translate-y-2 relative overflow-hidden ${selectedCondo?.id === condo.id ? 'border-gold-500 bg-slate-100 dark:bg-zinc-900 ring-4 ring-gold-500/5 shadow-2xl' : 'shadow-sm'}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="p-6 bg-white dark:bg-zinc-950 text-gold-600 border border-slate-200 dark:border-zinc-800 rounded-3xl group-hover:bg-gold-600 group-hover:text-black transition-all shadow-xl">
                <Building2 size={36} />
              </div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => handleEditCondo(condo, e)} className="p-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-400 hover:text-gold-500 shadow-sm transition-all"><Edit2 size={18} /></button>
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-4 group-hover:gold-gradient-text transition-all leading-none">{condo.name}</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-zinc-500">
                <MapPin size={16} className="text-gold-600 shrink-0" /> <span className="truncate">{condo.address}</span>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest mb-1">Unidades</span>
                  <span className="text-xl font-black text-slate-950 dark:text-white group-hover:text-gold-600 transition-colors">{condo.totalUnits}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest mb-1">Dossiês Ativos</span>
                  <span className="text-xl font-black text-gold-600">{condo.activeProcesses} Litígios</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCondo && (
        <div className="premium-card rounded-[3rem] md:rounded-[4rem] overflow-hidden animate-in slide-in-from-top-4 duration-700 shadow-3xl">
          <div className="p-10 md:p-14 border-b border-slate-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-slate-50/50 dark:bg-zinc-950/50 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-black dark:bg-white rounded-3xl text-white dark:text-black shadow-3xl"><LayoutList size={28} /></div>
              <div>
                <h2 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter leading-none mb-2 uppercase">{selectedCondo.name}</h2>
                <p className="text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-[0.4em]">Sub-Painel: Unidades Alpha Habitacionais</p>
              </div>
            </div>
            <button
              onClick={() => setIsUnitModalOpen(true)}
              className="w-full md:w-auto bg-white dark:bg-black text-slate-950 dark:text-white border border-slate-200 dark:border-zinc-800 px-8 py-4.5 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:border-gold-500 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
            >
              <Plus size={16} /> Registrar Unidade Alpha
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-900">
                <tr>
                  <th className="px-12 py-7 text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest text-left">Identificação Alpha</th>
                  <th className="px-12 py-7 text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest text-left">Titularidade Jurídica</th>
                  <th className="px-12 py-7 text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest text-left">Governança Fiscal</th>
                  <th className="px-12 py-7 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 bg-white dark:bg-black">
                {condoUnits.map(unit => (
                  <tr
                    key={unit.id}
                    onClick={() => handleOpenUnitDetail(unit)}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 group cursor-pointer transition-all"
                  >
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[1.8rem] flex items-center justify-center text-slate-950 dark:text-zinc-500 font-black text-sm shadow-xl group-hover:bg-gold-600 group-hover:text-black group-hover:border-gold-500 transition-all">
                          {unit.block}{unit.number}
                        </div>
                        <span className="text-base font-black text-slate-950 dark:text-zinc-300 group-hover:text-gold-600 transition-colors uppercase font-mono">B.{unit.block} • UN.{unit.number}</span>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-sm font-bold text-slate-500 dark:text-zinc-600 group-hover:text-slate-950 dark:group-hover:text-zinc-300 transition-colors">{unit.owner}</td>
                    <td className="px-12 py-8">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full border shadow-sm ${unit.status === 'Debt' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                          unit.status === 'LegalAction' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                            'bg-gold-600/10 text-gold-600 border-gold-600/20'
                        }`}>
                        {unit.status === 'Debt' ? 'Protocolo: Inadimplente' : unit.status === 'LegalAction' ? 'Litígio Ativo' : 'Compliance Alpha: OK'}
                      </span>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-950 text-slate-400 group-hover:bg-gold-600 group-hover:text-black shadow-xl transition-all">
                        <ChevronRight size={22} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Registrar Unidade Gestora */}
      <Modal
        isOpen={isCondoModalOpen || !!editingCondo}
        onClose={() => { setIsCondoModalOpen(false); setEditingCondo(null); }}
        title={editingCondo ? "Governança: Atualizar Ativo" : "Registrar Unidade Gestora Alpha"}
      >
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Denominação do Empreendimento</label>
            <input defaultValue={editingCondo?.name} required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: Edifício Solar das Palmeiras" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">CNPJ Institucional</label>
              <input defaultValue={editingCondo?.cnpj} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="00.000.000/0001-00" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Síndico / Gestor Alpha</label>
              <input defaultValue={editingCondo?.manager} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Nome do Responsável" />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Localização Física Alpha (Endereço)</label>
            <input defaultValue={editingCondo?.address} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Rua, Número, Bairro, Cidade/UF" />
          </div>
          <div className="pt-8 flex flex-col sm:flex-row gap-6 border-t border-slate-100 dark:border-zinc-900">
            <button type="button" onClick={() => { setIsCondoModalOpen(false); setEditingCondo(null); }} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Cancelar</button>
            <button type="submit" onClick={() => { setIsCondoModalOpen(false); setEditingCondo(null); }} className="flex-[2] py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all">
              {editingCondo ? "Efetivar Alteração" : "Confirmar Registro Alpha"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Registrar Unidade Habitacional */}
      <Modal isOpen={isUnitModalOpen} onClose={() => setIsUnitModalOpen(false)} title="Nova Unidade Habitacional Alpha">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Torre / Bloco</label>
              <input required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: Torre A" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Número da Unidade</label>
              <input required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: 101" />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Titular de Direito (Proprietário)</label>
            <input required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Nome Completo do Titular" />
          </div>
          <div className="pt-8 flex flex-col sm:flex-row gap-6 border-t border-slate-100 dark:border-zinc-900">
            <button type="button" onClick={() => setIsUnitModalOpen(false)} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Abortar</button>
            <button type="submit" onClick={() => setIsUnitModalOpen(false)} className="flex-[2] py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all">Efetivar Unidade Alpha</button>
          </div>
        </form>
      </Modal>

      {/* Modal Dossie Unidade */}
      <Modal isOpen={isUnitDetailOpen} onClose={() => setIsUnitDetailOpen(false)} title={`Dossiê: Unidade ${activeUnit?.block}${activeUnit?.number}`}>
        {activeUnit && (
          <div className="space-y-10">
            <div className="p-10 bg-black dark:bg-zinc-950 rounded-[3rem] border border-gold-500/10 shadow-3xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 rounded-full blur-[60px]" />
              <div className="p-6 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 text-gold-500 shadow-2xl relative z-10 group-hover:bg-gold-600 group-hover:text-black transition-all">
                <Building2 size={42} />
              </div>
              <div className="space-y-2 relative z-10 text-center md:text-left">
                <h4 className="text-3xl font-black italic font-serif gold-gradient-text leading-none">{activeUnit.owner}</h4>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Torre {activeUnit.block} • Apartamento {activeUnit.number}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h5 className="text-[11px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.4em] flex items-center gap-3">
                  <History size={18} className="text-gold-600" /> Histórico Operacional
                </h5>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                  {activeUnit.logs.map(log => (
                    <div key={log.id} className="p-6 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-gold-600 uppercase tracking-widest">{log.action}</span>
                        <span className="text-[9px] font-black text-slate-400 font-mono italic">{log.timestamp}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-zinc-400 leading-relaxed">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-8">
                <div className="p-10 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-gold-500" size={24} />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gold-600">AI Alpha Prediction</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-zinc-500 leading-relaxed font-bold">
                    Unidade com alta probabilidade de adimplemento espontâneo. Recomendamos notificação consultiva amigável.
                  </p>
                </div>
                <button onClick={() => setIsUnitDetailOpen(false)} className="w-full py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all shadow-2xl">Fechar Dossiê Alpha</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
