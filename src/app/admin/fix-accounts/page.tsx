'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function FixAccountsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [fixedCount, setFixedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const runFix = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await axios.get('/api/admin/fix-accounts');
      setResult(response.data);
      if (response.data.users) {
        setFixedCount(response.data.users.filter((u: any) => u.fixed).length);
      }
    } catch (error: any) {
      console.error('Error fixing accounts:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Failed to fix accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const runDBSetup = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await axios.get('/api/setup-db');
      setResult(response.data);
      setFixedCount(0); // Reset count as this is a different operation
    } catch (error: any) {
      console.error('Error setting up database:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Failed to set up database');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-secondary mb-6">Fix Admin Accounts</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-secondary mb-4">Current System Status</h2>
        <p className="mb-6">
          This page helps you diagnose and fix issues with admin accounts. If you're seeing 
          "User is not an admin" errors when logging in, you can use the tools below to fix your accounts.
        </p>
        
        {errorMessage && (
          <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-md">
            <p>{errorMessage}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={runDBSetup}
            disabled={isLoading}
            className="bg-secondary hover:bg-secondary-dark text-white py-2 px-4 rounded disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Working...' : 'Setup Database Structure'}
          </button>
          
          <button
            onClick={runFix}
            disabled={isLoading}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Working...' : 'Fix All Accounts'}
          </button>
        </div>
        
        {result && (
          <div className="bg-green-50 text-green-700 p-4 rounded-md">
            <p className="font-medium mb-2">{result.message}</p>
            {result.users && (
              <div>
                <p>Fixed {fixedCount} out of {result.users.length} accounts.</p>
                {fixedCount > 0 && (
                  <p className="mt-2">You should now be able to log in with these accounts.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-secondary mb-4">Manual Fix Instructions</h2>
        <p className="mb-4">
          If the automatic fix doesn't work, you can manually fix your accounts by running the following 
          SQL in the Supabase SQL Editor:
        </p>
        
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
          {`-- Update all profiles to be admins
UPDATE profiles SET is_admin = TRUE;

-- If no profile exists for your user, create one
INSERT INTO profiles (id, is_admin)
VALUES ('your-user-id', TRUE)
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;`}
        </pre>
        
        <p className="mb-4">
          Replace 'your-user-id' with your actual user ID from Supabase Authentication.
        </p>
        
        <div className="mt-8 flex justify-end">
          <Link 
            href="/admin/login" 
            className="text-sm text-primary hover:text-primary-dark hover:underline transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 