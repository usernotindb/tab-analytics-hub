
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  Calculator,
  FileCheck,
  FileX,
  CreditCard,
  Settings,
  Database,
  CheckCircle,
  XCircle,
  Building2,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    
    // Notify user
    toast.success("You have been logged out successfully");
    
    // Redirect to login page
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Tax Customers",
      path: "/customers",
      icon: Users,
    },
    {
      title: "Portals & Installations",
      path: "/portals",
      icon: Database,
    },
    {
      title: "Paid Software",
      path: "/paid-software",
      icon: CreditCard,
    },
    {
      title: "Portal Status",
      path: "/portal-status",
      icon: Calculator,
      subItems: [
        {
          title: "Ready",
          path: "/portal-status/ready",
          icon: CheckCircle,
        },
        {
          title: "Not Ready",
          path: "/portal-status/not-ready",
          icon: XCircle,
        },
      ],
    },
    {
      title: "Bank Applications",
      path: "/bank-applications",
      icon: Building2,
      subItems: [
        {
          title: "Submitted",
          path: "/bank-applications/submitted",
          icon: FileCheck,
        },
        {
          title: "Unsubmitted",
          path: "/bank-applications/unsubmitted",
          icon: FileX,
        },
      ],
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center p-6">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Calculator className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-semibold">TAB Analytics</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={cn(
                    isActive(item.path) && "bg-primary/10 text-primary"
                  )}>
                    <Link to={item.path} className="flex items-center space-x-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  
                  {item.subItems && (
                    <div className="pl-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <SidebarMenuButton key={subItem.path} asChild className={cn(
                          "text-sm py-1.5",
                          isActive(subItem.path) && "bg-primary/10 text-primary"
                        )}>
                          <Link to={subItem.path} className="flex items-center space-x-2">
                            <subItem.icon className="w-4 h-4" />
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenuButton asChild className="w-full">
          <button 
            className="flex items-center space-x-2 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
