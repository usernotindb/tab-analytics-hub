
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from "recharts";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Users, CreditCard, 
  CheckCircle, XCircle, FileCheck, 
  FileX, TrendingUp, TrendingDown
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/apiService";
import { toast } from "sonner";
import { Customer, Portal, SoftwarePayment, BankApplication } from "@/lib/schema";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch customers data
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<Customer[]>({
    queryKey: ['dashboard', 'customers'],
    queryFn: async () => {
      try {
        return await apiService.get('/customers');
      } catch (error) {
        toast.error("Failed to load customers data");
        return [];
      }
    },
  });

  // Fetch portals data
  const { data: portals = [], isLoading: isLoadingPortals } = useQuery<Portal[]>({
    queryKey: ['dashboard', 'portals'],
    queryFn: async () => {
      try {
        return await apiService.get('/portals');
      } catch (error) {
        toast.error("Failed to load portals data");
        return [];
      }
    },
  });

  // Fetch software payments data
  const { data: payments = [], isLoading: isLoadingSoftware } = useQuery<SoftwarePayment[]>({
    queryKey: ['dashboard', 'software-payments'],
    queryFn: async () => {
      try {
        return await apiService.get('/software-payments');
      } catch (error) {
        toast.error("Failed to load software payments data");
        return [];
      }
    },
  });

  // Fetch bank applications data
  const { data: applications = [], isLoading: isLoadingApplications } = useQuery<BankApplication[]>({
    queryKey: ['dashboard', 'bank-applications'],
    queryFn: async () => {
      try {
        return await apiService.get('/bank-applications');
      } catch (error) {
        toast.error("Failed to load bank applications data");
        return [];
      }
    },
  });

  // Process data for charts
  const customerData = customers.length > 0 
    ? processCustomerGrowth(customers)
    : [
        { month: 'Jan', customers: 40 },
        { month: 'Feb', customers: 55 },
        { month: 'Mar', customers: 70 },
        { month: 'Apr', customers: 85 },
        { month: 'May', customers: 100 },
        { month: 'Jun', customers: 115 },
      ];

  // Calculate real status counts
  const readyPortals = portals.filter(p => p.installed).length;
  const notReadyPortals = portals.filter(p => !p.installed).length;
  const paidSoftware = payments.filter(p => p.status === 'paid').length;
  const submittedApps = applications.filter(a => a.status === 'submitted').length;
  const unsubmittedApps = applications.filter(a => a.status === 'unsubmitted').length;

  const statusData = [
    { name: 'Portal Ready', value: readyPortals || 25, color: '#4ade80' },
    { name: 'Portal Not Ready', value: notReadyPortals || 15, color: '#f87171' },
    { name: 'Bank App Submitted', value: submittedApps || 30, color: '#60a5fa' },
    { name: 'Bank App Unsubmitted', value: unsubmittedApps || 10, color: '#fbbf24' },
    { name: 'Paid Software', value: paidSoftware || 20, color: '#a78bfa' },
  ];

  // Calculate stats
  const totalCustomers = customers.length;
  const percentChangeCustomers = calculatePercentChange(totalCustomers, 145); // Hardcoded for now
  
  const percentChangePortalsReady = calculatePercentChange(readyPortals, 72);
  const percentChangePortalsNotReady = calculatePercentChange(notReadyPortals, 33);
  const percentChangePaidSoftware = calculatePercentChange(paidSoftware, 98);

  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers.toString() || "145",
      change: formatPercentChange(percentChangeCustomers),
      trend: percentChangeCustomers >= 0 ? "up" : "down",
      icon: Users,
      color: "bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-300"
    },
    {
      title: "Portals Ready",
      value: readyPortals.toString() || "72",
      change: formatPercentChange(percentChangePortalsReady),
      trend: percentChangePortalsReady >= 0 ? "up" : "down",
      icon: CheckCircle,
      color: "bg-green-50 text-green-500 dark:bg-green-900/20 dark:text-green-300"
    },
    {
      title: "Portals Not Ready",
      value: notReadyPortals.toString() || "33",
      change: formatPercentChange(percentChangePortalsNotReady),
      trend: percentChangePortalsNotReady >= 0 ? "up" : "down",
      icon: XCircle,
      color: "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-300"
    },
    {
      title: "Paid Software",
      value: paidSoftware.toString() || "98",
      change: formatPercentChange(percentChangePaidSoftware),
      trend: percentChangePaidSoftware >= 0 ? "up" : "down",
      icon: CreditCard,
      color: "bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-300"
    },
  ];

  const isLoading = isLoadingCustomers || isLoadingPortals || isLoadingSoftware || isLoadingApplications;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {isLoading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs flex items-center pt-1 text-muted-foreground">
                    {stat.trend === "up" ? 
                      <TrendingUp className="mr-1 h-3 w-3 text-green-500" /> : 
                      <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    }
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {stat.change}
                    </span>
                    <span className="ml-1">from last month</span>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
          </CardHeader>
          <CardContent className="p-2 h-80">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : isClient && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerData} margin={{ top: 20, right: 30, left: isMobile ? 0 : 20, bottom: 20 }}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }} 
                  />
                  <Bar dataKey="customers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-2 h-80 flex items-center justify-center">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : isClient && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={isMobile ? 90 : 100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions
function processCustomerGrowth(customers: Customer[]) {
  // Group customers by month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  // Initialize data for the last 6 months
  const data = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    data.push({
      month: months[date.getMonth()],
      customers: 0,
      year: date.getFullYear()
    });
  }
  
  // Count customers by creation month
  customers.forEach(customer => {
    const creationDate = new Date(customer.created_at);
    const monthIndex = creationDate.getMonth();
    const year = creationDate.getFullYear();
    
    // Only consider data from current year
    if (year === currentYear) {
      const dataIndex = data.findIndex(item => item.month === months[monthIndex] && item.year === year);
      if (dataIndex !== -1) {
        data[dataIndex].customers++;
      }
    }
  });
  
  return data;
}

function calculatePercentChange(current: number, previous: number) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function formatPercentChange(percent: number) {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

export default Dashboard;
