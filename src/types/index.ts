export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  skills: string[];
  experience: number; // in years
  education: string;
  resume?: string; // URL to resume file
  status: 'new' | 'reviewing' | 'interviewed' | 'offer' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
} 