import { getSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Candidate } from '@/types';
import CandidateDetailActions from './CandidateDetailActions';

export const dynamic = 'force-dynamic';

async function getCandidate(id: string): Promise<Candidate | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    console.error('Error fetching candidate:', error);
    return null;
  }

  // Map the database fields to the Candidate interface
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    position: data.position,
    skills: data.skills,
    experience: data.experience,
    education: data.education,
    resume: data.resume || undefined,
    status: data.status,
    notes: data.notes || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export default async function CandidateDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const candidate = await getCandidate(params.id);
  
  if (!candidate) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/candidates"
            className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground"
          >
            <svg 
              className="h-4 w-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            Back to Candidates
          </Link>
        </div>
      </div>
      
      <CandidateDetailActions candidate={candidate} />
    </div>
  );
} 