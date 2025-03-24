'use client';

import { useState, useEffect } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';
import CandidateCard from '@/components/CandidateCard';
import { Candidate } from '@/types';
import Link from 'next/link';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of candidates
    const fetchCandidates = async () => {
      try {
        const supabase = getBrowserClient();
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map the database fields to the Candidate interface
        const mappedData = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone || undefined,
          position: item.position,
          skills: item.skills,
          experience: item.experience,
          education: item.education,
          resume: item.resume || undefined,
          status: item.status,
          notes: item.notes || undefined,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
        
        setCandidates(mappedData);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();

    // Subscribe to real-time changes
    const supabase = getBrowserClient();
    
    // Subscribe to INSERT events on candidates table
    const subscription = supabase
      .channel('candidates_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'candidates' 
        }, 
        (payload) => {
          // Map the new candidate to the Candidate interface
          const newCandidate: Candidate = {
            id: payload.new.id,
            name: payload.new.name,
            email: payload.new.email,
            phone: payload.new.phone || undefined,
            position: payload.new.position,
            skills: payload.new.skills,
            experience: payload.new.experience,
            education: payload.new.education,
            resume: payload.new.resume || undefined,
            status: payload.new.status,
            notes: payload.new.notes || undefined,
            createdAt: payload.new.created_at,
            updatedAt: payload.new.updated_at
          };
          
          // Add the new candidate to the existing list
          setCandidates(prevCandidates => [newCandidate, ...prevCandidates]);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Talent Explorer</h1>
        <p className="text-foreground/70 mt-2">Browse through our collection of talented professionals</p>
      </div>
      
      {candidates.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg border-foreground/20">
          <h3 className="text-xl font-medium text-foreground/80 mb-2">No candidates available</h3>
          <p className="text-foreground/60 mb-6">Check back later for updated profiles.</p>
          <Link
            href="/careers"
            className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
          >
            View Open Positions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
} 