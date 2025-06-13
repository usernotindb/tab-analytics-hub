
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  entityType?: 'customer' | 'portal' | 'bank_app' | 'software';
  entityId?: number;
}

export class NotificationService {
  private static notifications: Notification[] = [];
  private static listeners: ((notifications: Notification[]) => void)[] = [];

  static addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(newNotification);
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default'
    });

    // Notify listeners
    this.notifyListeners();
  }

  static getNotifications(): Notification[] {
    return this.notifications;
  }

  static getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  static markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  static markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  static clearNotifications(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  static subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Predefined notification creators
  static notifyCustomerCreated(customerName: string, customerId: number): void {
    this.addNotification({
      type: 'success',
      title: 'Customer Created',
      message: `New customer "${customerName}" has been added to the system.`,
      entityType: 'customer',
      entityId: customerId
    });
  }

  static notifyPortalStatusChanged(portalName: string, status: string, portalId: number): void {
    this.addNotification({
      type: 'info',
      title: 'Portal Status Updated',
      message: `Portal "${portalName}" status changed to ${status}.`,
      entityType: 'portal',
      entityId: portalId
    });
  }

  static notifyBankAppSubmitted(bankName: string, appId: number): void {
    this.addNotification({
      type: 'success',
      title: 'Bank Application Submitted',
      message: `Application for ${bankName} has been submitted successfully.`,
      entityType: 'bank_app',
      entityId: appId
    });
  }

  static notifyError(title: string, message: string): void {
    this.addNotification({
      type: 'error',
      title,
      message
    });
  }
}
