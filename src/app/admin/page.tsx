'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase-browser';
import { getSupabaseClient } from '@/lib/supabase';

// Fetch stats server-side to avoid client-side data fetching errors
async function getStats() {
  const supabase = getSupabaseClient();
  
  // Get total count of candidates
  const { count: totalCount, error: countError } = await supabase
    .from('candidates')
    .select('*', { count: 'exact', head: true });
  
  // Get count by status
  const { data: statusData, error: statusError } = await supabase
    .from('candidates')
    .select('status')
    .not('status', 'is', null);
  
  const statusCounts: Record<string, number> = {};
  
  if (statusData) {
    statusData.forEach(item => {
      const status = item.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
  }
  
  return {
    totalCount: totalCount || 0,
    statusCounts
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({ totalCount: 0, statusCounts: {} });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/admin/login');
          return;
        }
        
        setUser(currentUser);
        
        // Fetch stats
        const statsData = await fetch('/api/admin/stats')
          .then(res => res.json())
          .catch(err => {
            console.error('Error fetching stats:', err);
            return { totalCount: 0, statusCounts: {} };
          });
        
        setStats(statsData);
      } catch (err) {
        console.error('Error checking authentication:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">Admin Dashboard</h1>
        <Link
          href="/candidates"
          className="text-sm font-medium text-secondary hover:text-primary transition-colors"
        >
          View Candidates
        </Link>
      </div>
      
      {/* Welcome section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-secondary mb-2">
          Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'}
        </h2>
        <p className="text-secondary/70">
          This is your admin dashboard where you can manage candidates and view application statistics.
        </p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
        <div className="bg-white rounded-lg shadow-sm border border-color overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-secondary mb-1">Total Candidates</h2>
                <p className="text-3xl font-bold text-primary">{stats.totalCount}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <svg 
                  className="h-8 w-8 text-primary" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                href="/candidates" 
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                View all candidates →
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-color overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-secondary mb-1">New Applications</h2>
                <p className="text-3xl font-bold text-primary">{stats.statusCounts.new || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg 
                  className="h-8 w-8 text-blue-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                href="/admin/profile" 
                className="text-sm font-medium text-secondary hover:text-secondary-dark transition-colors"
              >
                Edit your profile →
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-color overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-secondary mb-1">Pending Offers</h2>
                <p className="text-3xl font-bold text-primary">{stats.statusCounts.offer || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg 
                  className="h-8 w-8 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                href="/admin/fix-accounts" 
                className="text-sm font-medium text-secondary hover:text-secondary-dark transition-colors"
              >
                Admin tools →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 