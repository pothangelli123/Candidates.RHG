'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CandidateForm from '@/components/CandidateForm';
import { Candidate } from '@/types';
import axios from 'axios';

type EditCandidateFormProps = {
  candidate: Candidate;
};

export default function EditCandidateForm({ candidate }: EditCandidateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (data: Partial<Candidate>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await axios.patch(`/api/candidates/${candidate.id}`, data);
      router.push(`/candidates/${candidate.id}`);
      router.refresh();
    } catch (err) {
      console.error('Error updating candidate:', err);
      setError('Failed to update candidate. Please try again.');
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
      
      <CandidateForm 
        initialData={candidate} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
} 