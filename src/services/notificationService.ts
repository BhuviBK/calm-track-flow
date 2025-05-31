
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export class NotificationService {
  static async initialize() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Notifications only available on native platforms');
      return;
    }

    try {
      // Request permission for notifications
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display === 'granted') {
        console.log('Notification permissions granted');
        await this.scheduleDailyTaskReminder();
      } else {
        console.log('Notification permissions denied');
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  static async scheduleDailyTaskReminder() {
    // Cancel any existing notifications first
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

    const motivationalProverbs = [
      "Today's accomplishments were yesterday's impossibilities. Check your tasks!",
      "The journey of a thousand miles begins with a single step. What's your first task today?",
      "Success is the sum of small efforts repeated daily. Review your tasks!",
      "Don't wait for opportunity. Create it with today's tasks!",
      "Every morning brings new potential. What will you accomplish today?",
      "The early bird catches the worm. Time to tackle your tasks!",
      "Today is a fresh start. Make it count with your planned tasks!"
    ];

    const randomProverb = motivationalProverbs[Math.floor(Math.random() * motivationalProverbs.length)];

    // Schedule daily notification at 6 AM
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(6, 0, 0, 0);

    // If it's already past 6 AM today, schedule for tomorrow
    if (now.getTime() > scheduledTime.getTime()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Today's Tasks Await! 📋",
            body: randomProverb,
            id: 1,
            schedule: {
              at: scheduledTime,
              repeats: true,
              every: 'day'
            },
            sound: 'default',
            actionTypeId: 'OPEN_TASKS',
            extra: {
              route: '/todo'
            }
          }
        ]
      });

      console.log('Daily task reminder scheduled for 6 AM');
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  static async handleNotificationClick() {
    // Listen for notification clicks
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Notification clicked:', notification);
      
      // Navigate to todo page when notification is clicked
      if (notification.notification.extra?.route) {
        window.location.href = notification.notification.extra.route;
      }
    });
  }

  static async cancelAllNotifications() {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  }
}
