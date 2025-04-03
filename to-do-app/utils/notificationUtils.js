/**
 * Bildirim Yardımcı Fonksiyonları - Güncel SDK uyumlu
 * 
 * Uygulama içi bildirimleri yönetmek için modern API kullanımı.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Bildirimleri yapılandır
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,      // Bildirim uyarısı göster
    shouldPlaySound: true,      // Bildirim sesi çal
    shouldSetBadge: false,      // Uygulama rozeti kullanma
  }),
});

/**
 * Cihazın bildirimler için uygun olup olmadığını kontrol eder
 */
export const isPushNotificationsAvailable = async () => {
  if (!Device.isDevice) {
    console.log('Bildirimler sadece fiziksel cihazlarda test edilmelidir.');
    return false;
  }
  return true;
};

/**
 * Bildirim izinlerini kontrol eder ve gerekirse ister
 */
export const checkNotificationPermissions = async () => {
  try {
    if (!await isPushNotificationsAvailable()) {
      return false;
    }
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }
    
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.log('Bildirim izinleri kontrol edilirken hata oluştu:', error);
    return false;
  }
};

/**
 * Son tarihli görev için bildirim planlar
 */
export const scheduleTaskReminder = async (task) => {
  // Son tarih yoksa bildirim oluşturma
  if (!task.dueDate) return null;
  
  // Bildirim izni kontrolü
  const hasPermission = await checkNotificationPermissions();
  if (!hasPermission) return null;
  
  // Bildirim zamanını ayarla
  const trigger = new Date(task.dueDate);
  // Görev gününde sabah 9'da bildirim gönder
  trigger.setHours(9, 0, 0);
  
  // Eğer bildirim zamanı geçmişse bildirim gönderme
  if (trigger <= new Date()) return null;
  
  try {
    // Önceden aynı görev için planlanmış bildirimleri iptal et
    await cancelTaskNotifications(task.id);
    
    // Yeni bildirimi planla
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Görev Hatırlatıcısı',
        body: `"${task.title}" görevi bugün son gün!`,
        data: { taskId: task.id, type: 'task-reminder' },
      },
      trigger,
    });
    
    return notificationId;
  } catch (error) {
    console.log('Bildirim oluşturma hatası:', error);
    return null;
  }
};

/**
 * Görev ID'sine göre bildirimlerini iptal eder
 */
export const cancelTaskNotifications = async (taskId) => {
  try {
    // Planlanan tüm bildirimleri al
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    // Bu görevle ilgili bildirimleri bul ve iptal et
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.taskId === taskId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.log('Bildirimleri iptal ederken hata oluştu:', error);
  }
};

/**
 * Günlük özet bildirimi planlar
 */
export const scheduleDailyReminder = async (activeTasks) => {
  // Bildirim izni kontrolü
  const hasPermission = await checkNotificationPermissions();
  if (!hasPermission) return null;
  
  // Tamamlanmamış görev sayısını bul
  const pendingTasks = activeTasks.filter(task => !task.completed).length;
  
  try {
    // Günlük bildirimi planla (her sabah saat 8'de)
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Günlük Planlayıcı',
        body: `Bugün ${pendingTasks} tamamlanmamış göreviniz var.`,
        data: { type: 'daily-reminder' },
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true, // Bildirim her gün tekrarlanır
      },
    });
    
    return notificationId;
  } catch (error) {
    console.log('Günlük bildirim hatası:', error);
    return null;
  }
};

/**
 * Bildirimlere tıklandığında tepki vermek için olay dinleyici
 */
export const addNotificationResponseListener = (handleNotification) => {
  return Notifications.addNotificationResponseReceivedListener(response => {
    handleNotification(response.notification.request.content.data);
  });
};
