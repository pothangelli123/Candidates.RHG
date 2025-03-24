import { getSupabaseClient } from '@/lib/supabase';
import CandidateCard from '@/components/CandidateCard';
import { Candidate } from '@/types';

export const dynamic = 'force-dynamic';

async function getCandidates(): Promise<Candidate[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }

  // Map the database fields to the Candidate interface
  return (data || []).map(item => ({
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
}

export default async function CandidatesPage() {
  const candidates = await getCandidates();
  
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
        </div>
      ) : (
        <>
          {/* Simple filter/search UI - could be enhanced with actual filtering */}
          <div className="mb-8 bg-accent p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3">
                <label htmlFor="search" className="block text-sm font-medium text-foreground/70 mb-1">
                  Search
                </label>
                <input 
                  type="text" 
                  id="search" 
                  placeholder="Search by name or skill"
                  className="w-full px-3 py-2 border border-foreground/20 rounded-md"
                />
              </div>
              <div className="w-full md:w-1/4">
                <label htmlFor="status" className="block text-sm font-medium text-foreground/70 mb-1">
                  Status
                </label>
                <select 
                  id="status" 
                  className="w-full px-3 py-2 border border-foreground/20 rounded-md"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="w-full md:w-1/4">
                <label htmlFor="sort" className="block text-sm font-medium text-foreground/70 mb-1">
                  Sort By
                </label>
                <select 
                  id="sort" 
                  className="w-full px-3 py-2 border border-foreground/20 rounded-md"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-md">
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Enhanced grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </>
      )}
    </div>
  );
} 