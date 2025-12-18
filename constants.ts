
import { Task, AgendaItem, Process, Client, FinancialRecord, Condominium, Unit, Course, ReportData, LawyerPerformance } from './types';

export const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Protocolar Recurso - Caso Silva", status: "A Fazer", priority: "High", tag: "Cível", description: "Revisar jurisprudência.", assignee: "Dr. Carlos", dueDate: "2023-10-25" },
  { id: 2, title: "Reunião Condomínio Solar", status: "Em Andamento", priority: "Medium", tag: "Extrajudicial", description: "Preparar minuta.", assignee: "Dra. Amanda", dueDate: "2023-10-26" },
  { id: 3, title: "Petição Inicial - Divórcio", status: "A Fazer", priority: "High", tag: "Família", description: "Urgente.", assignee: "Dr. Carlos", dueDate: "2023-10-24" },
];

export const AGENDA_ITEMS: AgendaItem[] = [
  { id: 1, time: "09:00", title: "Audiência 3ª Vara Cível", type: "Audience" },
  { id: 2, time: "14:30", title: "Reunião Cliente Novo", type: "Meeting" },
  { id: 3, time: "18:00", title: "Prazo: Contestação Silva", type: "Deadline" },
];

export const KANBAN_COLUMNS = ["A Fazer", "Em Andamento", "Aguardando Cliente", "Concluído"] as const;

export const MOCK_CONDOMINIUMS: Condominium[] = [
  { id: '1', name: 'Edifício Solar das Palmeiras', cnpj: '12.345.678/0001-00', address: 'Rua das Flores, 123', totalUnits: 48, activeProcesses: 3, manager: 'Sra. Helena' },
  { id: '2', name: 'Residencial Alpha Garden', cnpj: '98.765.432/0001-11', address: 'Av. Paulista, 1500', totalUnits: 120, activeProcesses: 12, manager: 'Sr. Roberto' },
];

export const MOCK_UNITS: Unit[] = [
  { 
    id: 'u1', 
    condoId: '1', 
    number: '101', 
    block: 'A', 
    owner: 'Carlos Eduardo', 
    status: 'Normal', 
    logs: [
      { id: 'l1', timestamp: '2023-10-20 14:00', user: 'Dr. Carlos', action: 'Atualização', details: 'Proprietário confirmou recebimento da notificação via AR.' },
      { id: 'l2', timestamp: '2023-10-01 09:30', user: 'Dra. Amanda', action: 'Criação', details: 'Unidade cadastrada no sistema após convenção.' }
    ] 
  },
  { id: 'u2', condoId: '1', number: '102', block: 'A', owner: 'Marta Rocha', status: 'Debt', logs: [] }
];

export const MOCK_PROCESSES: Process[] = [
  { 
    id: '1', 
    number: '0004567-89.2023.8.26.0100', 
    title: 'Silva vs Construtora XYZ', 
    client: 'Roberto Silva', 
    court: '3ª Vara Cível SP', 
    status: 'Active', 
    lastUpdate: '2023-10-15', 
    value: 'R$ 150.000,00',
    updates: [
      { id: '1', date: '2023-10-15', description: 'Juntada de Petição de Réplica aos termos da contestação.', author: 'Dr. Carlos' },
      { id: '2', date: '2023-09-28', description: 'Publicação de despacho saneador deferindo prova pericial.', author: 'Tribunal de Justiça' }
    ]
  },
];

export const MOCK_CLIENTS: Client[] = [
  { 
    id: 1, 
    name: 'Roberto Silva', 
    email: 'roberto@email.com', 
    phone: '(11) 99999-9999', 
    type: 'Person', 
    status: 'Active', 
    activeCases: 2,
    address: 'Av. Paulista, 2000, Apto 55, São Paulo/SP',
    interactions: [
      { id: '1', date: '2023-10-20', type: 'WhatsApp', summary: 'Cliente solicitou andamento do processo 4567-89.' },
      { id: '2', date: '2023-09-15', type: 'Meeting', summary: 'Reunião de alinhamento para entrega de documentos originais.' }
    ]
  },
];

export const MOCK_FINANCIAL: FinancialRecord[] = [
  { id: 1, description: 'Honorários Iniciais - Silva', type: 'Income', amount: 'R$ 5.000,00', date: '2023-10-01', category: 'Honorários', status: 'Paid' },
];

export const MOCK_TRAINING: Course[] = [
  { id: 1, title: "Dominando o STARJUS Elite OS", thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800", duration: "45 min", category: "Sistema", progress: 100 },
];

export const MOCK_REPORTS_FINANCIAL: ReportData[] = [
  { month: 'Jun', revenue: 12000, expenses: 4000 },
  { month: 'Jul', revenue: 15000, expenses: 5000 },
  { month: 'Ago', revenue: 14000, expenses: 4500 },
  { month: 'Set', revenue: 18000, expenses: 6000 },
  { month: 'Out', revenue: 21000, expenses: 5500 },
];

export const MOCK_LAWYER_PERFORMANCE: LawyerPerformance[] = [
  { name: 'Dr. Carlos Silva', tasksCompleted: 45, billableHours: 120, winRate: 88 },
  { name: 'Dra. Amanda Rosa', tasksCompleted: 38, billableHours: 95, winRate: 92 },
  { name: 'Dr. Bruno Costa', tasksCompleted: 22, billableHours: 60, winRate: 75 },
];
