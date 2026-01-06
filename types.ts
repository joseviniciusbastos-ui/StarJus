
import React from 'react';

export type TaskStatus = 'A Fazer' | 'Em Andamento' | 'Aguardando Cliente' | 'Concluído';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  tag: string;
  dueDate?: string;
  assignee?: string;
  description?: string;
  isRunning?: boolean;
  timeSpent?: number;
}

export interface AgendaItem {
  id: number;
  time: string;
  title: string;
  type: 'Audience' | 'Meeting' | 'Deadline';
}

export interface ProcessUpdate {
  id: string;
  date: string;
  description: string;
  author: string;
}

export interface Process {
  id: string;
  number: string;
  title: string;
  client: string;
  court: string;
  status: 'Active' | 'Suspended' | 'Done';
  lastUpdate: string;
  value: string;
  updates: ProcessUpdate[];
}

export interface Condominium {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  totalUnits: number;
  activeProcesses: number;
  manager: string;
}

export interface UnitLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface Unit {
  id: string;
  condoId: string;
  number: string;
  block: string;
  owner: string;
  status: 'Normal' | 'Debt' | 'LegalAction';
  logs: UnitLog[];
}

export interface Interaction {
  id: string;
  date: string;
  type: 'Email' | 'WhatsApp' | 'Call' | 'Meeting';
  summary: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'Person' | 'Company';
  status: 'Active' | 'Inactive';
  activeCases: number;
  address: string;
  interactions: Interaction[];
}

export interface FinancialRecord {
  id: number;
  description: string;
  type: 'Income' | 'Expense';
  amount: string; // Backward compatibility
  amount_numeric: number; // For calculations
  currency: 'BRL' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'ARS';
  amount_brl: number; // Always store BRL equivalent
  exchange_rate: number;
  date: string;
  category: string;
  status: 'Paid' | 'Pending';
}


export interface StatMetric {
  label: string;
  value: string;
  trend: string;
  icon: React.ElementType;
  isPositive: boolean;
}

export interface Course {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
  progress: number;
}

// Novos tipos para Relatórios
export interface ReportData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface LawyerPerformance {
  name: string;
  tasksCompleted: number;
  billableHours: number;
  winRate: number;
}
