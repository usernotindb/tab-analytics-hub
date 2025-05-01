
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, CheckCircle, XCircle } from 'lucide-react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useDatabase } from '@/hooks/use-database';

// Define the route structure for route inventory
interface RouteInfo {
  path: string;
  component: string;
  parentRoute?: string;
  isNested: boolean;
  params?: string[];
  isActive: boolean;
}

// Define the navigation item structure for sidebar items
interface NavigationItem {
  title: string;
  path: string;
  icon: string;
  subItems?: NavigationItem[];
  isActive: boolean;
}

// Define issue structure for reporting
interface NavigationIssue {
  type: 'error' | 'warning' | 'info';
  description: string;
  affectedRoute?: string;
  recommendation: string;
}

const NavigationAudit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isConfigured } = useDatabase();
  const [activeTab, setActiveTab] = useState('inventory');
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [issues, setIssues] = useState<NavigationIssue[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  
  // Function to extract routes from App.tsx (simulation)
  const extractRoutes = () => {
    // This would ideally be a more robust implementation
    // For now, we're creating a static representation of routes
    const appRoutes: RouteInfo[] = [
      { path: '/', component: 'Dashboard', isNested: false, isActive: location.pathname === '/' },
      { path: '/customers', component: 'Customers', isNested: false, isActive: location.pathname === '/customers' },
      { path: '/customers/:id', component: 'CustomerDetails', isNested: true, parentRoute: '/customers', params: ['id'], isActive: location.pathname.startsWith('/customers/') && location.pathname !== '/customers' },
      { path: '/portals', component: 'Portals', isNested: false, isActive: location.pathname === '/portals' },
      { path: '/portals/:id', component: 'PortalDetails', isNested: true, parentRoute: '/portals', params: ['id'], isActive: location.pathname.startsWith('/portals/') && location.pathname !== '/portals' },
      { path: '/paid-software', component: 'PaidSoftware', isNested: false, isActive: location.pathname === '/paid-software' },
      { path: '/portal-status/ready', component: 'PortalStatusReady', isNested: true, parentRoute: '/portal-status', isActive: location.pathname === '/portal-status/ready' },
      { path: '/portal-status/not-ready', component: 'PortalStatusNotReady', isNested: true, parentRoute: '/portal-status', isActive: location.pathname === '/portal-status/not-ready' },
      { path: '/bank-applications/submitted', component: 'BankApplicationsSubmitted', isNested: true, parentRoute: '/bank-applications', isActive: location.pathname === '/bank-applications/submitted' },
      { path: '/bank-applications/unsubmitted', component: 'BankApplicationsUnsubmitted', isNested: true, parentRoute: '/bank-applications', isActive: location.pathname === '/bank-applications/unsubmitted' },
      { path: '/settings', component: 'Settings', isNested: false, isActive: location.pathname === '/settings' },
      { path: '/navigation-audit', component: 'NavigationAudit', isNested: false, isActive: location.pathname === '/navigation-audit' },
      { path: '*', component: 'NotFound', isNested: false, isActive: false },
    ];
    
    setRoutes(appRoutes);
    return appRoutes;
  };

  // Function to map sidebar navigation items
  const mapSidebarItems = () => {
    // This would ideally inspect the actual sidebar component
    // For now, we're creating a static representation
    const sidebarItems: NavigationItem[] = [
      {
        title: 'Dashboard',
        path: '/',
        icon: 'BarChart3',
        isActive: location.pathname === '/',
      },
      {
        title: 'Tax Customers',
        path: '/customers',
        icon: 'Users',
        isActive: location.pathname === '/customers' || location.pathname.startsWith('/customers/'),
      },
      {
        title: 'Portals & Installations',
        path: '/portals',
        icon: 'Database',
        isActive: location.pathname === '/portals' || location.pathname.startsWith('/portals/'),
      },
      {
        title: 'Paid Software',
        path: '/paid-software',
        icon: 'CreditCard',
        isActive: location.pathname === '/paid-software',
      },
      {
        title: 'Portal Status',
        path: '/portal-status',
        icon: 'Calculator',
        isActive: location.pathname.startsWith('/portal-status'),
        subItems: [
          {
            title: 'Ready',
            path: '/portal-status/ready',
            icon: 'CheckCircle',
            isActive: location.pathname === '/portal-status/ready',
          },
          {
            title: 'Not Ready',
            path: '/portal-status/not-ready',
            icon: 'XCircle',
            isActive: location.pathname === '/portal-status/not-ready',
          },
        ],
      },
      {
        title: 'Bank Applications',
        path: '/bank-applications',
        icon: 'Building2',
        isActive: location.pathname.startsWith('/bank-applications'),
        subItems: [
          {
            title: 'Submitted',
            path: '/bank-applications/submitted',
            icon: 'FileCheck',
            isActive: location.pathname === '/bank-applications/submitted',
          },
          {
            title: 'Unsubmitted',
            path: '/bank-applications/unsubmitted',
            icon: 'FileX',
            isActive: location.pathname === '/bank-applications/unsubmitted',
          },
        ],
      },
      {
        title: 'Settings',
        path: '/settings',
        icon: 'Settings',
        isActive: location.pathname === '/settings',
      },
      {
        title: 'Navigation Audit',
        path: '/navigation-audit',
        icon: 'CheckCircle',
        isActive: location.pathname === '/navigation-audit',
      },
    ];
    
    setNavItems(sidebarItems);
    return sidebarItems;
  };

  // Function to analyze routes and navigation for issues
  const analyzeNavigation = (appRoutes: RouteInfo[], sidebarItems: NavigationItem[]) => {
    const navIssues: NavigationIssue[] = [];
    
    // Check for routes without sidebar items
    const sidebarPaths = flattenNavItems(sidebarItems).map(item => item.path);
    const routePaths = appRoutes.map(route => route.path);
    
    // Find routes without navigation items
    routePaths.forEach(path => {
      if (path !== '*' && path !== '/navigation-audit' && !sidebarPaths.includes(path)) {
        navIssues.push({
          type: 'warning',
          description: `Route '${path}' exists but has no corresponding sidebar navigation item`,
          affectedRoute: path,
          recommendation: 'Add a navigation item in the sidebar for this route or consider if the route is needed',
        });
      }
    });
    
    // Find navigation items without routes
    sidebarPaths.forEach(path => {
      // Skip parent paths that are just categories
      if (!path.includes('*') && !routePaths.includes(path) && 
          !appRoutes.some(route => route.parentRoute === path)) {
        navIssues.push({
          type: 'error',
          description: `Navigation item with path '${path}' has no corresponding route`,
          affectedRoute: path,
          recommendation: 'Add a route for this navigation item or remove it from the sidebar',
        });
      }
    });
    
    // Check for parameterized routes without parent routes
    appRoutes.forEach(route => {
      if (route.params?.length && !sidebarItems.some(item => 
        item.path === route.parentRoute || 
        item.subItems?.some(subItem => subItem.path === route.parentRoute)
      )) {
        navIssues.push({
          type: 'info',
          description: `Parameterized route '${route.path}' may need a parent navigation item`,
          affectedRoute: route.path,
          recommendation: 'Consider how users navigate to this detail page',
        });
      }
    });

    // Database configuration check
    if (!isConfigured) {
      navIssues.push({
        type: 'warning',
        description: 'Database is not configured, some routes may not function correctly',
        recommendation: 'Configure the database in Settings',
      });
    }
    
    setIssues(navIssues);
    return navIssues;
  };

  // Helper function to flatten nested navigation items
  const flattenNavItems = (items: NavigationItem[]): NavigationItem[] => {
    return items.reduce<NavigationItem[]>((acc, item) => {
      acc.push(item);
      if (item.subItems?.length) {
        acc.push(...flattenNavItems(item.subItems));
      }
      return acc;
    }, []);
  };

  // Function to run the full audit
  const runAudit = () => {
    setIsAuditing(true);
    toast({
      title: "Navigation audit started",
      description: "Examining routes and navigation...",
    });
    
    try {
      const appRoutes = extractRoutes();
      const sidebarItems = mapSidebarItems();
      const navIssues = analyzeNavigation(appRoutes, sidebarItems);
      
      toast({
        title: "Navigation audit complete",
        description: `Found ${navIssues.length} issues to review`,
      });
    } catch (error) {
      toast({
        title: "Audit error",
        description: "There was a problem completing the audit",
        variant: "destructive",
      });
      console.error("Navigation audit error:", error);
    } finally {
      setIsAuditing(false);
    }
  };

  // Initialize the audit data on component mount
  useEffect(() => {
    extractRoutes();
    mapSidebarItems();
  }, [location.pathname]);

  // Generate a visual representation of the sitemap
  const renderSitemap = () => {
    // Group routes by their parent routes
    const routeGroups: { [key: string]: RouteInfo[] } = {};
    
    routes.forEach(route => {
      if (route.parentRoute) {
        if (!routeGroups[route.parentRoute]) {
          routeGroups[route.parentRoute] = [];
        }
        routeGroups[route.parentRoute].push(route);
      }
    });
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Application Sitemap</h3>
        
        <div className="space-y-4">
          {routes
            .filter(route => !route.isNested && route.path !== '*')
            .map(route => (
              <div key={route.path} className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {route.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-gray-300"></div>
                    )}
                    <h4 className="font-medium">{route.component}</h4>
                  </div>
                  <div className="text-sm text-muted-foreground">{route.path}</div>
                </div>
                
                {routeGroups[route.path] && (
                  <div className="mt-3 pl-6 border-l-2 border-gray-200 space-y-2">
                    {routeGroups[route.path].map(childRoute => (
                      <div key={childRoute.path} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {childRoute.isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                          )}
                          <span>{childRoute.component}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{childRoute.path}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Navigation & Routing Audit</CardTitle>
          <CardDescription>
            Analyze the application's navigation structure and identify potential issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="inventory">Route Inventory</TabsTrigger>
              <TabsTrigger value="sitemap">Visual Sitemap</TabsTrigger>
              <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
              <TabsTrigger value="report">Audit Report</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Path</TableHead>
                      <TableHead>Component</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.map(route => (
                      <TableRow key={route.path} className={route.isActive ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">
                          {route.path}
                          {route.params?.length ? (
                            <span className="ml-1 text-xs text-muted-foreground">
                              (params: {route.params.join(', ')})
                            </span>
                          ) : null}
                        </TableCell>
                        <TableCell>{route.component}</TableCell>
                        <TableCell>{route.isNested ? 'Nested' : 'Root'}</TableCell>
                        <TableCell className="text-right">
                          {route.isActive ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                              <CheckCircle className="mr-1 h-3 w-3" /> Active
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">Inactive</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="sitemap">
              {renderSitemap()}
            </TabsContent>
            
            <TabsContent value="issues">
              {issues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-medium">No issues detected</h3>
                  <p className="text-muted-foreground">
                    The navigation structure appears to be correctly implemented
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Affected Route</TableHead>
                        <TableHead>Recommendation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issues.map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                              ${issue.type === 'error' ? 'bg-red-100 text-red-800' : ''}
                              ${issue.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${issue.type === 'info' ? 'bg-blue-100 text-blue-800' : ''}
                            `}>
                              {issue.type}
                            </span>
                          </TableCell>
                          <TableCell>{issue.description}</TableCell>
                          <TableCell>{issue.affectedRoute || 'N/A'}</TableCell>
                          <TableCell>{issue.recommendation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="report">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Navigation Audit Summary</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Total Routes:</span>
                      <span className="font-medium">{routes.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Active Route:</span>
                      <span className="font-medium">{location.pathname}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Navigation Items:</span>
                      <span className="font-medium">{flattenNavItems(navItems).length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Issues Found:</span>
                      <span className="font-medium">{issues.length}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Ensure all routes have corresponding navigation items</li>
                    <li>Verify that all navigation links point to valid routes</li>
                    <li>Consider user flow when designing nested routes</li>
                    <li>Test all navigation paths with and without parameters</li>
                    <li>Implement consistent error handling for invalid routes</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button 
            onClick={runAudit}
            disabled={isAuditing}
          >
            {isAuditing ? 'Running Audit...' : 'Run Full Audit'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NavigationAudit;
