/**
 * Tarih Yardımcı Fonksiyonları
 * 
 * Uygulama genelinde tarih işlemleri için kullanılan yardımcı fonksiyonlar.
 */

/**
 * Tarih nesnesini formatlı string'e dönüştürür (GG.AA.YYYY)
 * @param {Date} date - Formatlanacak tarih
 * @returns {string} - Formatlanmış tarih string'i
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  // 01.05.2023 formatında tarih döndür
  const day = date.getDate().toString().padStart(2, '0');        // Gün (01-31)
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ay (01-12)
  const year = date.getFullYear();                                 // Yıl (2023)
  
  return `${day}.${month}.${year}`;
};

/**
 * Verilen tarihin bugün olup olmadığını kontrol eder
 * @param {Date} date - Kontrol edilecek tarih
 * @returns {boolean} - Tarih bugünse true, değilse false
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const today = new Date();
  return date.getDate() === today.getDate() &&         // Gün
    date.getMonth() === today.getMonth() &&            // Ay
    date.getFullYear() === today.getFullYear();        // Yıl
};

/**
 * Verilen tarihin yarın olup olmadığını kontrol eder
 * @param {Date} date - Kontrol edilecek tarih
 * @returns {boolean} - Tarih yarınsa true, değilse false
 */
export const isTomorrow = (date) => {
  if (!date) return false;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Bugün + 1 gün = Yarın
  
  return date.getDate() === tomorrow.getDate() &&      // Gün
    date.getMonth() === tomorrow.getMonth() &&         // Ay
    date.getFullYear() === tomorrow.getFullYear();     // Yıl
};

/**
 * Verilen tarihin geçmiş (son tarihi geçmiş) olup olmadığını kontrol eder
 * @param {Date} date - Kontrol edilecek tarih
 * @returns {boolean} - Tarih geçmişse true, değilse false
 */
export const isOverdue = (date) => {
  if (!date) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Bugünün başlangıcı (gece yarısı)
  
  return date < today; // Tarih bugünden önceyse
};
