'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CandidateDetail from '@/components/CandidateDetail';
import { Candidate } from '@/types';
import axios from 'axios';

type CandidateDetailActionsProps = {
  candidate: Candidate;
};

export default function CandidateDetailActions({ candidate }: CandidateDetailActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await axios.delete(`/api/candidates/${candidate.id}`);
      router.push('/candidates');
      router.refresh();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setIsDeleting(false);
      // Could add error state handling here
    }
  };
  
  return (
    <CandidateDetail 
      candidate={candidate} 
      onDelete={handleDelete} 
      isDeleting={isDeleting} 
    />
  );
} 