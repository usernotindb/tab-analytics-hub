
import { useState, useEffect } from "react";
import { getAuditLogs, AuditLogEntry } from "@/utils/audit/auditLogger";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Refresh, Eye, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AuditLogViewer = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<{
    entityType?: AuditLogEntry['entityType'];
    entityId?: number;
  }>({});
  const { toast } = useToast();

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const result = await getAuditLogs(filter.entityType, filter.entityId);
      if (result.success && result.data) {
        setLogs(result.data);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch audit logs",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const getActionBadgeVariant = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'default';
      case 'update':
        return 'secondary';
      case 'delete':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatValues = (values?: Record<string, any>) => {
    if (!values) return '-';
    return Object.entries(values)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Audit Log</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading}>
              <Refresh className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {isLoading ? "Loading audit logs..." : "No audit logs found."}
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{log.userId}</TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell>{log.entityId}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.action === 'update' ? (
                        <div className="space-y-1">
                          {log.oldValues && (
                            <div className="text-xs text-red-600">
                              Old: {formatValues(log.oldValues)}
                            </div>
                          )}
                          {log.newValues && (
                            <div className="text-xs text-green-600">
                              New: {formatValues(log.newValues)}
                            </div>
                          )}
                        </div>
                      ) : (
                        formatValues(log.newValues || log.oldValues)
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
