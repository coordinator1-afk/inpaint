/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Studio from './components/Studio';
import { User } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'studio'>('landing');
  
  // Try to load cached user or set default guest user
  const [user, setUser] = useState<User>(() => {
    const cached = localStorage.getItem('archlab_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // ignore
      }
    }
    return {
      loggedIn: false,
      email: '',
      name: '',
      role: '',
      credits: 0
    };
  });

  // Persist user details
  useEffect(() => {
    localStorage.setItem('archlab_user', JSON.stringify(user));
  }, [user]);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleUpdateCredits = (newCredits: number) => {
    setUser(prev => ({
      ...prev,
      credits: newCredits
    }));
  };

  const handleLogout = () => {
    setUser({
      loggedIn: false,
      email: '',
      name: '',
      role: '',
      credits: 0
    });
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] selection:bg-[#00F2FE]/30 selection:text-[#00F2FE]">
      {currentPage === 'landing' ? (
        <LandingPage 
          user={user}
          onAuthSuccess={handleAuthSuccess}
          onNavigateToStudio={() => setCurrentPage('studio')}
        />
      ) : (
        <Studio 
          user={user}
          onUpdateCredits={handleUpdateCredits}
          onBackToLanding={() => setCurrentPage('landing')}
        />
      )}
    </div>
  );
}

