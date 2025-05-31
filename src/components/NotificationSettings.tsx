
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff } from 'lucide-react';
import { NotificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

const NotificationSettings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notificationsEnabled') === 'true'
  );
  const { toast } = useToast();

  const toggleNotifications = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem('notificationsEnabled', enabled.toString());

    if (enabled) {
      await NotificationService.scheduleDailyTaskReminder();
      toast({
        title: "Notifications Enabled",
        description: "You'll receive daily task reminders at 6 AM",
      });
    } else {
      await NotificationService.cancelAllNotifications();
      toast({
        title: "Notifications Disabled",
        description: "Daily task reminders have been turned off",
      });
    }
  };

  const testNotification = async () => {
    try {
      await NotificationService.scheduleDailyTaskReminder();
      toast({
        title: "Test Notification Scheduled",
        description: "Check your device for the notification",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule test notification",
      });
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          Daily Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="text-sm">
            Daily task reminders at 6 AM
          </Label>
          <Switch
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={toggleNotifications}
          />
        </div>
        
        {notificationsEnabled && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testNotification}
              className="w-full"
            >
              Test Notification
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              You'll receive motivational reminders to check your tasks every morning
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
