'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CandidateForm from '@/components/CandidateForm';
import { Candidate } from '@/types';
import axios from 'axios';

export default function NewCandidateForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (data: Partial<Candidate>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await axios.post('/api/candidates', data);
      router.push('/candidates');
      router.refresh();
    } catch (err) {
      console.error('Error creating candidate:', err);
      setError('Failed to create candidate. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <CandidateForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
} 