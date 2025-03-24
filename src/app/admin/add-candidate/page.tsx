'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { getCurrentUser } from '@/lib/supabase-browser';
import CandidateForm from '@/components/CandidateForm';
import { Candidate } from '@/types';

export default function AddCandidatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/admin/login');
          return;
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (data: Partial<Candidate>) => {
    setSubmitting(true);
    setError(null);
    
    try {
      console.log("Preparing candidate data:", data);
      
      // Ensure skills is an array
      if (!Array.isArray(data.skills)) {
        data.skills = data.skills ? [data.skills as unknown as string] : [];
      }
      
      // Ensure experience is a number
      if (typeof data.experience !== 'number') {
        data.experience = Number(data.experience) || 0;
      }
      
      console.log("Submitting candidate data:", data);
      
      const response = await axios.post('/api/candidates', data);
      console.log("Response:", response.data);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/candidates');
          router.refresh();
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to add candidate');
      }
    } catch (err: any) {
      console.error('Error adding candidate:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'An error occurred while adding the candidate';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
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
            Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-secondary mt-4">Add New Candidate</h1>
        <p className="text-secondary/70 mt-2">Create a new candidate profile</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
          Candidate added successfully! Redirecting...
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <CandidateForm 
            onSubmit={handleSubmit}
            isSubmitting={submitting}
          />
        </div>
      )}
    </div>
  );
} 