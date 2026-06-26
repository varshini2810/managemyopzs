import React, { createContext, useContext, useState } from 'react';

const SuiteContext = createContext();

export function SuiteProvider({ children }) {
  const [currentSuite, setCurrentSuite] = useState('billing'); // default to Chargebee Billing

  return (
    <SuiteContext.Provider value={{ currentSuite, setCurrentSuite }}>
      {children}
    </SuiteContext.Provider>
  );
}

export function useSuite() {
  return useContext(SuiteContext);
}
