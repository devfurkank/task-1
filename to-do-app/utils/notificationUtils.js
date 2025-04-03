/**
 * Bildirim Yardımcı Fonksiyonları
 * 
 * Uygulama içi bildirimleri yönetmek için kullanılan fonksiyonlar.
 * Son tarih hatırlatıcıları ve günlük bildirimler oluşturur.
 */

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// Bildirimleri yapılandır - uygulama ön planda veya arka planda olsa bile bildirimler görünür
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,      // Bildirim uyarısı göster
    shouldPlaySound: true,      // Bildirim sesi çal
    shouldSetBadge: false,      // Uygulama rozeti kullanma
  }),
});

/**
 * Bildirim izinlerini kontrol eder ve gerekirse izin ister
 * @returns {Promise<boolean>} - İzin durumu (true: izin verildi, false: izin reddedildi)
 */
export const checkNotificationPermissions = async () => {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;
  
  // Eğer izin durumu belirli değilse, izin iste
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

/**
 * Son tarihli görev için bildirim planlar
 * @param {Object} task - Görev nesnesi
 * @returns {Promise<string|null>} - Bildirim ID'si veya null
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
    // Bildirimi planla
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Görev Hatırlatıcısı',
        body: `"${task.title}" görevi bugün son gün!`,
        data: { taskId: task.id }, // Bildirimle ilişkili veri
      },
      trigger, // Bildirim zamanı
    });
    
    return notificationId;
  } catch (error) {
    console.log('Bildirim oluşturma hatası:', error);
    return null;
  }
};

/**
 * Günlük özet bildirimi planlar
 * @param {Array} activeTasks - Tüm görevler dizisi
 * @returns {Promise<string|null>} - Bildirim ID'si veya null
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
