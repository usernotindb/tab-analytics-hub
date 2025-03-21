
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from "recharts";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Users, CreditCard, 
  CheckCircle, XCircle, FileCheck, 
  FileX, TrendingUp, TrendingDown
} from "lucide-react";

// Sample data - in a real app, this would come from your API
const customerData = [
  { month: 'Jan', customers: 40 },
  { month: 'Feb', customers: 55 },
  { month: 'Mar', customers: 70 },
  { month: 'Apr', customers: 85 },
  { month: 'May', customers: 100 },
  { month: 'Jun', customers: 115 },
];

const statusData = [
  { name: 'Portal Ready', value: 25, color: '#4ade80' },
  { name: 'Portal Not Ready', value: 15, color: '#f87171' },
  { name: 'Bank App Submitted', value: 30, color: '#60a5fa' },
  { name: 'Bank App Unsubmitted', value: 10, color: '#fbbf24' },
  { name: 'Paid Software', value: 20, color: '#a78bfa' },
];

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const stats = [
    {
      title: "Total Customers",
      value: "145",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-300"
    },
    {
      title: "Portals Ready",
      value: "72",
      change: "+4.3%",
      trend: "up",
      icon: CheckCircle,
      color: "bg-green-50 text-green-500 dark:bg-green-900/20 dark:text-green-300"
    },
    {
      title: "Portals Not Ready",
      value: "33",
      change: "-2.7%",
      trend: "down",
      icon: XCircle,
      color: "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-300"
    },
    {
      title: "Paid Software",
      value: "98",
      change: "+8.1%",
      trend: "up",
      icon: CreditCard,
      color: "bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-300"
    },
  ];

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
            {isClient && (
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
            {isClient && (
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

export default Dashboard;
