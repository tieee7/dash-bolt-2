import React, { createContext, useContext, useState, useEffect } from 'react';

interface Domain {
  id: string;
  name: string;
  icon?: string;
}

interface DomainContextType {
  currentDomain: Domain;
  setCurrentDomain: (domain: Domain) => void;
  updateDomainName: (name: string) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export function DomainProvider({ children }: { children: React.ReactNode }) {
  const [currentDomain, setCurrentDomain] = useState<Domain>(() => {
    const saved = localStorage.getItem('selectedDomain');
    return saved ? JSON.parse(saved) : { id: '1', name: 'example.com', icon: '🌐' };
  });

  const updateDomainName = (name: string) => {
    setCurrentDomain(prev => ({ ...prev, name }));
  };

  useEffect(() => {
    localStorage.setItem('selectedDomain', JSON.stringify(currentDomain));
  }, [currentDomain]);

  return (
    <DomainContext.Provider value={{ currentDomain, setCurrentDomain, updateDomainName }}>
      {children}
    </DomainContext.Provider>
  );
}

export function useDomain() {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error('useDomain must be used within a DomainProvider');
  }
  return context;
}