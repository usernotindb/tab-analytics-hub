
import { useSettings } from "@/hooks/use-settings";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  UserCircle,
  Settings as SettingsIcon,
  Bell,
  Lock,
  Building,
  Database,
  Save,
  AlertCircle
} from "lucide-react";
import { DatabaseStatusCard } from "@/components/database/DatabaseStatusCard";
import { useState, useEffect } from "react";

const Settings = () => {
  const { 
    settings, 
    isLoading, 
    saveProfileSettings, 
    saveNotificationSettings, 
    saveCompanySettings, 
    saveDatabaseSettings 
  } = useSettings();
  
  // Profile settings state
  const [profileSettings, setProfileSettings] = useState(settings.profile);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState(settings.notifications);

  // Company settings state
  const [companySettings, setCompanySettings] = useState(settings.company);

  // Database settings state
  const [databaseSettings, setDatabaseSettings] = useState(settings.database);

  // Update local state when settings are loaded
  useEffect(() => {
    if (!isLoading) {
      setProfileSettings(settings.profile);
      setNotificationSettings(settings.notifications);
      setCompanySettings(settings.company);
      setDatabaseSettings(settings.database);
    }
  }, [isLoading, settings]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanySettings(prev => ({ ...prev, [name]: value }));
  };

  const handleDatabaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatabaseSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleDatabaseSwitchChange = (key: string, value: boolean) => {
    setDatabaseSettings(prev => ({ ...prev, [key]: value }));
  };

  // Save settings by category
  const saveSettings = (section: string) => {
    switch(section) {
      case 'profile':
        saveProfileSettings(profileSettings);
        break;
      case 'notification':
        saveNotificationSettings(notificationSettings);
        break;
      case 'company':
        saveCompanySettings(companySettings);
        break;
      case 'database':
      case 'backup':
        saveDatabaseSettings(databaseSettings);
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full animate-slide-in">
        <TabsList className="mb-6 grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={profileSettings.name} 
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={profileSettings.email} 
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={profileSettings.phone} 
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input 
                    id="role" 
                    name="role" 
                    value={profileSettings.role}
                    onChange={handleProfileChange}
                    disabled
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="space-x-2" 
                  onClick={() => saveSettings('profile')}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Update your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>

                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="space-x-2" 
                  onClick={() => saveSettings('security')}
                >
                  <Lock className="h-4 w-4" />
                  <span>Update Security</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </div>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>App Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications within the application
                    </div>
                  </div>
                  <Switch 
                    checked={notificationSettings.appNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('appNotifications', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive promotional and marketing emails
                    </div>
                  </div>
                  <Switch 
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Customer Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Get notified when a new customer is added
                    </div>
                  </div>
                  <Switch 
                    checked={notificationSettings.newCustomerAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('newCustomerAlerts', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Updates</Label>
                    <div className="text-sm text-muted-foreground">
                      Get notified about system updates and maintenance
                    </div>
                  </div>
                  <Switch 
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('systemUpdates', checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="space-x-2" 
                onClick={() => saveSettings('notification')}
              >
                <Save className="h-4 w-4" />
                <span>Save Preferences</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={companySettings.companyName} 
                    onChange={handleCompanyChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / EIN</Label>
                  <Input 
                    id="taxId" 
                    name="taxId" 
                    value={companySettings.taxId} 
                    onChange={handleCompanyChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={companySettings.address} 
                    onChange={handleCompanyChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={companySettings.city} 
                    onChange={handleCompanyChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={companySettings.state} 
                    onChange={handleCompanyChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input 
                    id="zip" 
                    name="zip" 
                    value={companySettings.zip} 
                    onChange={handleCompanyChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Business Phone</Label>
                  <Input 
                    id="companyPhone" 
                    name="phone" 
                    value={companySettings.phone} 
                    onChange={handleCompanyChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    value={companySettings.website} 
                    onChange={handleCompanyChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="space-x-2" 
                onClick={() => saveSettings('company')}
              >
                <Save className="h-4 w-4" />
                <span>Save Company Info</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Database Connection Card */}
            <DatabaseStatusCard />
            
            <Card>
              <CardHeader>
                <CardTitle>Backup & Maintenance</CardTitle>
                <CardDescription>
                  Configure database backup and maintenance settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backups</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable automatic database backups
                    </div>
                  </div>
                  <Switch 
                    checked={databaseSettings.autoBackup}
                    onCheckedChange={(checked) => handleDatabaseSwitchChange('autoBackup', checked)}
                  />
                </div>
                
                {databaseSettings.autoBackup && (
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <select 
                      id="backupFrequency" 
                      name="backupFrequency" 
                      value={databaseSettings.backupFrequency}
                      onChange={handleDatabaseChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <p className="text-sm font-medium">Manual Actions</p>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="justify-start">
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Run Database Maintenance
                    </Button>
                    
                    <Button variant="outline" className="justify-start">
                      <Database className="mr-2 h-4 w-4" />
                      Create Manual Backup
                    </Button>
                    
                    <Button variant="outline" className="justify-start text-amber-600 hover:text-amber-700">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Reset Database Tables
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="space-x-2" 
                  onClick={() => saveSettings('backup')}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Backup Settings</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
