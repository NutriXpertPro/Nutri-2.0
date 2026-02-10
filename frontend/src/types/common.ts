// Tipos comuns usados em toda a aplicação

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  professional_title: string | null;
  gender: string | null;
  profile_picture: string | null;
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: 'pt-BR' | 'en-US';
    notifications_email: boolean;
    notifications_push: boolean;
  };
}

export interface PatientProfile {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  height: number | null;
  weight: number | null;
  goal: string | null;
  gender: 'male' | 'female' | null;
  age: number | null;
  service_type: string;
}

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  avatar?: string;
  type: "presencial" | "online";
  duration: number; // em minutos
  description?: string;
  isNow?: boolean;
}

export interface BirthdayPatient {
  id: number;
  name: string;
  avatar: string | null;
  age: number | null;
  date: string;
}

export interface Metric {
  label: string;
  value: string | number;
  trend?: number;
  isPositive?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  avatar?: string;
  goal: string;
  metrics: Metric[];
}