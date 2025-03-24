'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { getBrowserClient, getCurrentUser, signOut as supabaseSignOut } from '@/lib/supabase-browser';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      setLoading(true);
      
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          // Fetch user profile data to get name
          const supabase = getBrowserClient();
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', currentUser.id)
            .single();
          
          if (profileData?.full_name) {
            setProfileName(profileData.full_name);
          } else {
            // Fallback to email or user metadata
            setProfileName(
              currentUser.user_metadata?.full_name || 
              currentUser.email?.split('@')[0] || 
              'Admin'
            );
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [pathname]); // Re-run when path changes
  
  const handleSignOut = async () => {
    await supabaseSignOut();
    setUser(null);
    setProfileName('');
    setShowDropdown(false);
    router.push('/admin/login');
  };
  
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <header className="bg-white border-b border-color sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-secondary">
              Candidates.RHG
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8 ml-12">
              <Link
                href="/candidates"
                className={`px-2 py-1.5 text-sm font-medium ${
                  isActive('/candidates')
                    ? 'text-primary font-semibold border-b-2 border-primary'
                    : 'text-secondary/80 hover:text-primary transition-colors'
                }`}
              >
                Candidates
              </Link>
              
              <Link
                href="/careers"
                className={`px-2 py-1.5 text-sm font-medium ${
                  isActive('/careers')
                    ? 'text-primary font-semibold border-b-2 border-primary'
                    : 'text-secondary/80 hover:text-primary transition-colors'
                }`}
              >
                Careers
              </Link>
              
              <Link
                href="/about"
                className={`px-2 py-1.5 text-sm font-medium ${
                  isActive('/about')
                    ? 'text-primary font-semibold border-b-2 border-primary'
                    : 'text-secondary/80 hover:text-primary transition-colors'
                }`}
              >
                About
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-medium">
                        {profileName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-secondary font-medium">Admin - {profileName}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-secondary/10">
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-secondary hover:bg-secondary/5"
                          onClick={() => setShowDropdown(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/admin/profile"
                          className="block px-4 py-2 text-sm text-secondary hover:bg-secondary/5"
                          onClick={() => setShowDropdown(false)}
                        >
                          My Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-secondary/5"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                  >
                    Login as Admin
                  </Link>
                )}
              </>
            )}
            
            {/* Mobile menu button - would implement hamburger menu for mobile */}
            <button className="md:hidden p-2 text-secondary">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 