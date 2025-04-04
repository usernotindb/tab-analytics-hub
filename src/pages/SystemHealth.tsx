
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/apiService";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, RefreshCw, Server, Database, Activity, Clock } from "lucide-react";
import configService from "@/services/configService";

const SystemHealth = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [memoryUsage, setMemoryUsage] = useState(65);
  const [cpuUsage, setCpuUsage] = useState(42);
  const [diskUsage, setDiskUsage] = useState(78);
  
  // Fetch system health
  const { data: healthData, isLoading, error, refetch } = useQuery({
    queryKey: ['system', 'health'],
    queryFn: async () => {
      try {
        return await apiService.get('/health');
      } catch (error) {
        throw new Error("Failed to fetch system health");
      }
    },
  });
  
  // Simulate changing system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryUsage(prev => Math.min(Math.max(prev + (Math.random() * 10 - 5), 15), 95));
      setCpuUsage(prev => Math.min(Math.max(prev + (Math.random() * 10 - 5), 10), 90));
      setDiskUsage(prev => Math.min(Math.max(prev + (Math.random() * 5 - 2), 20), 98));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Reset API configuration
  const handleResetApiConfig = () => {
    configService.resetApiUrl();
    toast.success("API configuration has been reset to default");
    refetch();
  };
  
  // Test database connection
  const { data: dbStatus, refetch: refetchDb } = useQuery({
    queryKey: ['system', 'database'],
    queryFn: async () => {
      try {
        return await apiService.post('/setup/test-db', {
          host: "localhost",
          port: 8236,
          user: "db_user",
          password: "db_password",
          database: "db_name"
        });
      } catch (error) {
        return { success: false, message: "Database connection failed" };
      }
    },
    enabled: false, // Don't run this query on page load
  });
  
  const handleTestDb = () => {
    refetchDb();
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API Status</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Server className="h-4 w-4 mr-2 text-blue-500" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{Math.round(memoryUsage)}%</div>
                <Progress value={memoryUsage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {memoryUsage > 80 ? "High memory usage" : "Normal usage"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-green-500" />
                  CPU Load
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{Math.round(cpuUsage)}%</div>
                <Progress value={cpuUsage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {cpuUsage > 75 ? "High CPU load" : "Normal load"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Database className="h-4 w-4 mr-2 text-purple-500" />
                  Disk Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{Math.round(diskUsage)}%</div>
                <Progress value={diskUsage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {diskUsage > 85 ? "High disk usage" : "Normal usage"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current system health and recent events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">System Uptime</h3>
                    <p className="text-sm text-muted-foreground">
                      {isLoading ? "Loading..." : "15 days, 7 hours, 23 minutes"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Server className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Application Server</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      {isLoading ? (
                        "Loading..."
                      ) : error ? (
                        <>
                          <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                          Offline
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          Online (Port 8235)
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Database className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Database Server</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      {isLoading ? (
                        "Loading..."
                      ) : dbStatus?.success ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          Connected
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-amber-500 mr-1" />
                          Status unknown
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">API Server</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      {isLoading ? (
                        "Loading..."
                      ) : healthData?.status === "OK" ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          Online (Port 8236)
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                          Offline
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Status</CardTitle>
              <CardDescription>
                Current API server status and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>API Connection Error</AlertTitle>
                  <AlertDescription>
                    Could not connect to API server. Please check your network connection and server status.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>API Server Online</AlertTitle>
                    <AlertDescription>
                      API server is running and responding to requests.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">API Configuration</h3>
                      <div className="rounded-md bg-muted p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">URL:</span>
                            <span className="text-sm font-mono">{configService.getApiUrl()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Port:</span>
                            <span className="text-sm font-mono">8236</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Version:</span>
                            <span className="text-sm font-mono">v1.0.0</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={handleResetApiConfig}
                      >
                        Reset API Configuration
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">API Health</h3>
                      <div className="rounded-md bg-muted p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <span className="text-sm font-medium text-green-600 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {healthData?.status || "OK"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Response Time:</span>
                            <span className="text-sm font-mono">187ms</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Last Checked:</span>
                            <span className="text-sm font-mono">{new Date().toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-2">
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Refresh Status
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Available endpoints and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/health</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GET</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Online
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">187ms</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/auth/verify</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GET</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Online
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">215ms</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/customers</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GET</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Online
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">312ms</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/setup/status</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GET</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Online
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">178ms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
              <CardDescription>
                Database connection and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Connection Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {dbStatus?.success ? "Connected" : "Status unknown"}
                  </p>
                </div>
                <Button onClick={handleTestDb} variant="outline" size="sm">
                  Test Connection
                </Button>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Database Configuration</h3>
                <div className="rounded-md bg-muted p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Host:</span>
                      <span className="text-sm font-mono">localhost</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Port:</span>
                      <span className="text-sm font-mono">8236</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Database:</span>
                      <span className="text-sm font-mono">atsat</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">User:</span>
                      <span className="text-sm font-mono">atsat</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Query Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">237ms</div>
                      <p className="text-xs text-muted-foreground">Average over last hour</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4/10</div>
                      <p className="text-xs text-muted-foreground">Current/Maximum</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>
                Overview of database tables and record counts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record Count</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">users</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-01 14:23:05</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.2 MB</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">customers</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">145</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-04 09:17:22</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.5 MB</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">portals</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">105</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-03 16:42:11</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.8 MB</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">software_payments</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">98</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-04 10:31:48</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.7 MB</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">bank_applications</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">40</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-02 11:14:37</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.4 MB</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealth;
