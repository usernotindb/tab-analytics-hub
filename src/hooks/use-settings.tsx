
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Profile settings type
export interface ProfileSettings {
  name: string;
  email: string;
  phone: string;
  role: string;
}

// Notification settings type
export interface NotificationSettings {
  emailNotifications: boolean;
  appNotifications: boolean;
  marketingEmails: boolean;
  newCustomerAlerts: boolean;
  systemUpdates: boolean;
}

// Company settings type
export interface CompanySettings {
  companyName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  taxId: string;
}

// Database settings type
export interface DatabaseSettings {
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  autoBackup: boolean;
  backupFrequency: string;
}

// All settings combined
export interface AppSettings {
  profile: ProfileSettings;
  notifications: NotificationSettings;
  company: CompanySettings;
  database: DatabaseSettings;
}

// Default settings
const defaultSettings: AppSettings = {
  profile: {
    name: "Admin User",
    email: "admin@tabanalytics.com",
    phone: "(555) 123-4567",
    role: "Administrator"
  },
  notifications: {
    emailNotifications: true,
    appNotifications: true,
    marketingEmails: false,
    newCustomerAlerts: true,
    systemUpdates: true
  },
  company: {
    companyName: "TAB Analytics, Inc.",
    address: "123 Business Ave, Suite 500",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    phone: "(555) 987-6543",
    website: "www.tabanalytics.com",
    taxId: "12-3456789"
  },
  database: {
    dbHost: "localhost",
    dbPort: "3306",
    dbName: "tab_analytics",
    dbUser: "admin",
    autoBackup: true,
    backupFrequency: "daily"
  }
};

export const useSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedSettings = localStorage.getItem('app_settings');
      
      if (storedSettings) {
        try {
          setSettings(JSON.parse(storedSettings));
        } catch (error) {
          console.error('Failed to parse stored settings', error);
          localStorage.removeItem('app_settings');
        }
      }
    }
    setIsLoading(false);
  }, [user]);

  // Save profile settings
  const saveProfileSettings = (profileSettings: ProfileSettings) => {
    setSettings(prev => ({
      ...prev,
      profile: profileSettings
    }));
    
    persistSettings({
      ...settings,
      profile: profileSettings
    });
    
    toast({
      title: "Profile settings saved",
      description: "Your profile settings have been updated successfully.",
    });
  };

  // Save notification settings
  const saveNotificationSettings = (notificationSettings: NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      notifications: notificationSettings
    }));
    
    persistSettings({
      ...settings,
      notifications: notificationSettings
    });
    
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated successfully.",
    });
  };

  // Save company settings
  const saveCompanySettings = (companySettings: CompanySettings) => {
    setSettings(prev => ({
      ...prev,
      company: companySettings
    }));
    
    persistSettings({
      ...settings,
      company: companySettings
    });
    
    toast({
      title: "Company information saved",
      description: "Your company information has been updated successfully.",
    });
  };

  // Save database settings
  const saveDatabaseSettings = (databaseSettings: DatabaseSettings) => {
    setSettings(prev => ({
      ...prev,
      database: databaseSettings
    }));
    
    persistSettings({
      ...settings,
      database: databaseSettings
    });
    
    toast({
      title: "Database settings saved",
      description: "Your database settings have been updated successfully.",
    });
  };

  // Helper to persist all settings to localStorage
  const persistSettings = (newSettings: AppSettings) => {
    if (user) {
      localStorage.setItem('app_settings', JSON.stringify(newSettings));
    }
  };

  return {
    settings,
    isLoading,
    saveProfileSettings,
    saveNotificationSettings,
    saveCompanySettings,
    saveDatabaseSettings
  };
};
