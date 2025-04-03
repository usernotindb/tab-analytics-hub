
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Edit, 
  Trash, 
  Monitor, 
  User, 
  CheckCircle, 
  XCircle,
  UserCheck,
  Clock,
  Calendar
} from "lucide-react";
import { getPortalById, deletePortal, getTimelineEvents } from "@/lib/api-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Portal, TimelineEvent } from "@/lib/schema";

const PortalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const portalId = Number(id);

  const { 
    data: portal, 
    isLoading: portalLoading, 
    error: portalError 
  } = useQuery({
    queryKey: ['portal', portalId],
    queryFn: () => getPortalById(portalId),
    enabled: !!portalId && !isNaN(portalId)
  });

  const { 
    data: timelineEvents = [], 
    isLoading: timelineLoading 
  } = useQuery({
    queryKey: ['timeline', 'portal', portalId],
    queryFn: () => getTimelineEvents('portal', portalId),
    enabled: !!portalId && !isNaN(portalId)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePortal(id),
    onSuccess: () => {
      toast({
        title: "Installation deleted",
        description: "The installation has been successfully removed.",
      });
      navigate("/portals");
      queryClient.invalidateQueries({ queryKey: ['portals'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the installation. Please try again.",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    }
  });

  const handleDelete = () => {
    if (portalId) {
      deleteMutation.mutate(portalId);
    }
  };

  useEffect(() => {
    if (portalError) {
      toast({
        title: "Error",
        description: "Failed to load portal details. Please try again later.",
        variant: "destructive",
      });
    }
  }, [portalError, toast]);

  if (portalLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!portal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/portals")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Installation Not Found</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">The requested installation was not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/portals")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {portal.company} - {portal.software}
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button 
            variant="destructive" 
            className="space-x-2" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash className="h-4 w-4" />
                <span>Delete</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full animate-slide-in">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Installation Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User ID</p>
                    <p>{portal.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Installation Type</p>
                    <p>{portal.type}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                    <p>{portal.company}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Software</p>
                    <p>{portal.software}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">License</p>
                    <p>{portal.license}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User Type</p>
                    <p>{portal.userType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Installed By</p>
                    <p>{portal.installed_by || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Installation Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {portal.installed ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Installed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-600">Not Installed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Installation Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timelineLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : timelineEvents.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">No timeline events found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timelineEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-4">
                        <div className="min-w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          {event.eventType === 'creation' ? (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          ) : event.eventType === 'update' ? (
                            <Clock className="h-4 w-4 text-primary" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                          </p>
                          <p className="text-sm mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">User information will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Installation history will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortalDetails;
