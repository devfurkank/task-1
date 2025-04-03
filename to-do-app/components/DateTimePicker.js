/**
 * TaskDatePicker Bileşeni
 * 
 * Görevlere son tarih eklemek için kullanılır.
 * Tarih seçiciyi açmak için buton ve seçilen tarihi gösterme/silme özelliklerini içerir.
 */

import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../utils/dateUtils';

/**
 * @param {Object} props - Bileşen özellikleri
 * @param {Date|null} props.date - Seçili tarih veya null
 * @param {Function} props.onDateChange - Tarih değiştiğinde çağrılan fonksiyon
 */
const TaskDatePicker = ({ date, onDateChange }) => {
  // Tarih seçiciyi gösterme/gizleme durumu
  const [show, setShow] = useState(false);

  /**
   * Tarih değiştiğinde çalışan fonksiyon
   * @param {Event} event - Tarih değiştirme olayı
   * @param {Date} selectedDate - Seçilen yeni tarih
   */
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // iOS için modal her zaman açık kalır, Android için seçim yapıldıktan sonra otomatik kapanır
    setShow(Platform.OS === 'ios');
    onDateChange(currentDate);
  };

  /**
   * Tarihi temizleme fonksiyonu
   */
  const handleClear = () => {
    onDateChange(null);
  };

  return (
    <View style={styles.container}>
      {/* Tarih Seçici Butonu */}
      <TouchableOpacity onPress={() => setShow(true)} style={styles.button}>
        <Ionicons name="calendar-outline" size={20} color="#4a86f7" />
        <Text style={styles.dateText}>
          {date ? formatDate(date) : 'Son tarih ekle'}
        </Text>
      </TouchableOpacity>
      
      {/* Tarih Temizleme Butonu (Sadece tarih seçiliyse göster) */}
      {date && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color="#888" />
        </TouchableOpacity>
      )}
      
      {/* DateTimePicker Bileşeni (Görünür olduğunda) */}
      {show && (
        <DateTimePicker
          value={date || new Date()} // Eğer tarih yoksa bugünü göster
          mode="date"               // Sadece tarih seçimi (saat değil)
          display="default"         // Platform varsayılan görünümü
          onChange={onChange}
          minimumDate={new Date()}  // Bugünden önceki tarihleri seçmeyi engelle
        />
      )}
    </View>
  );
};

// Bileşen stilleri
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    marginLeft: 8,
    color: '#333',
  },
  clearButton: {
    marginLeft: 8,
  }
});

export default TaskDatePicker;
