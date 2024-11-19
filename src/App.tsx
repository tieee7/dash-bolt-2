import React, { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Calendar from './components/Calendar';
import Conversations from './pages/Conversations';
import Domain from './pages/Domain';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import { DomainProvider } from './context/DomainContext';
import { Toaster } from 'react-hot-toast';

const validPages = ['dashboard', 'calendar', 'conversations', 'domain', 'integrations', 'settings', 'email', 'leads'];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(() => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage && validPages.includes(savedPage) ? savedPage : 'dashboard';
  });

  const { user, isLoading, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <DomainProvider>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="bottom-right" />
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <Header />
          <main>
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'calendar' && (
              <div className="p-6">
                <Calendar />
              </div>
            )}
            {currentPage === 'conversations' && <Conversations />}
            {currentPage === 'domain' && <Domain />}
            {currentPage === 'settings' && <Settings />}
            {!['dashboard', 'calendar', 'conversations', 'domain', 'settings'].includes(currentPage) && (
              <div className="p-6">
                <h2 className="text-2xl font-semibold">
                  {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
                </h2>
                <p className="text-gray-600 mt-2">
                  This page is under construction.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </DomainProvider>
  );
}