import React, { createContext, useContext, useState, ReactNode } from 'react';

type Region = "EU" | "US" | "ASIA" | null;

interface RegionContextProps {
  region: Region;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextProps | undefined>(undefined);

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegion] = useState<Region>(null);

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
};