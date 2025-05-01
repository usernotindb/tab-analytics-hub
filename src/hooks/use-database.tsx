
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { isDatabaseConfigured, getDbConfig, DatabaseConfig } from "@/utils/database/dbConnector";

interface DatabaseContextType {
  isConfigured: boolean;
  config: DatabaseConfig | null;
  refreshStatus: () => void;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isConfigured: false,
  config: null,
  refreshStatus: () => {}
});

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [isConfigured, setIsConfigured] = useState(isDatabaseConfigured());
  const [config, setConfig] = useState<DatabaseConfig | null>(getDbConfig());

  const refreshStatus = () => {
    setIsConfigured(isDatabaseConfigured());
    setConfig(getDbConfig());
  };

  useEffect(() => {
    // Check database status on mount
    refreshStatus();
    
    // Setup event listener to detect changes in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'db_config') {
        refreshStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ isConfigured, config, refreshStatus }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
