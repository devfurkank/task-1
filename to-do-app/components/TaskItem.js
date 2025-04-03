/**
 * TaskItem Bileşeni
 * 
 * Tek bir görev öğesini görüntüler. Görev başlığı, kategori,
 * öncelik ve son tarih bilgilerini içerir.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, isToday, isTomorrow, isOverdue } from '../utils/dateUtils';

// Kategori renklerini tanımlama
const CATEGORY_COLORS = {
  genel: '#4a86f7',   // Mavi
  is: '#f44336',      // Kırmızı
  kisisel: '#4caf50', // Yeşil
  alisveris: '#ff9800', // Turuncu
  saglik: '#9c27b0'   // Mor
};

// Öncelik ikonlarını tanımlama
const PRIORITY_ICONS = {
  low: 'arrow-down',  // Düşük öncelik - aşağı ok
  normal: 'remove',   // Normal öncelik - yatay çizgi
  high: 'arrow-up'    // Yüksek öncelik - yukarı ok
};

/**
 * @param {Object} props - Bileşen özellikleri
 * @param {Object} props.task - Görev nesnesi
 * @param {Function} props.onToggle - Görev durumu değiştiğinde çağrılan fonksiyon
 * @param {Function} props.onDelete - Görev silindiğinde çağrılan fonksiyon
 */
const TaskItem = ({ task, onToggle, onDelete }) => {
  // Kategori rengini al (tanımlı değilse varsayılan mavi renk kullan)
  const categoryColor = CATEGORY_COLORS[task.category] || '#4a86f7';
  
  /**
   * Son tarih durumunu belirler (Bugün, Yarın, Gecikti vb.)
   * @returns {Object|null} - Durum bilgisi ve renk içeren nesne veya null
   */
  const getDueDateStatus = () => {
    if (!task.dueDate) return null; // Son tarih yoksa null döndür
    
    const date = new Date(task.dueDate);
    
    // Tarih kontrollerini yap
    if (isOverdue(date) && !task.completed) {
      return { text: 'Gecikti', color: '#f44336' }; // Kırmızı
    } else if (isToday(date)) {
      return { text: 'Bugün', color: '#ff9800' }; // Turuncu
    } else if (isTomorrow(date)) {
      return { text: 'Yarın', color: '#4caf50' }; // Yeşil
    }
    
    // Diğer tarihler için formatlı tarih göster
    return { text: formatDate(date), color: '#757575' }; // Gri
  };
  
  // Son tarih durumunu al
  const dueDateStatus = getDueDateStatus();
  
  return (
    <TouchableOpacity onPress={() => onToggle(task.id)}>
      <View style={[styles.taskItem, task.completed && styles.completedTask]}>
        <View style={styles.leftContainer}>
          {/* Tamamlama Kontrolü - Checkbox */}
          <View 
            style={[
              styles.checkbox, 
              { borderColor: categoryColor }, 
              task.completed && styles.checkedBox
            ]}
          >
            {task.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          
          <View style={styles.taskContent}>
            {/* Görev Başlığı */}
            <Text style={[styles.taskText, task.completed && styles.completedTaskText]}>
              {task.title}
            </Text>
            
            {/* Görev Detayları - Kategori, Tarih ve Öncelik */}
            <View style={styles.taskDetails}>
              {/* Kategori Etiketi */}
              <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]}>
                <Text style={styles.categoryText}>{task.category}</Text>
              </View>
              
              {/* Tarih Bilgisi */}
              {dueDateStatus && (
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={12} color={dueDateStatus.color} />
                  <Text style={[styles.dateText, { color: dueDateStatus.color }]}>
                    {dueDateStatus.text}
                  </Text>
                </View>
              )}
              
              {/* Öncelik İkonu */}
              <View style={styles.priorityContainer}>
                <Ionicons 
                  name={PRIORITY_ICONS[task.priority]} 
                  size={12} 
                  color={
                    task.priority === 'high' ? '#f44336' : 
                    task.priority === 'low' ? '#4caf50' : 
                    '#757575'
                  } 
                />
              </View>
            </View>
          </View>
        </View>
        
        {/* Silme Butonu */}
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task.id)}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// Bileşen stilleri
const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#4a86f7',
    borderColor: '#4a86f7',
  },
  taskContent: {
    flex: 1,
  },
  completedTask: {
    backgroundColor: '#f8f9fa',
    opacity: 0.8,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  dateText: {
    fontSize: 10,
    marginLeft: 2,
  },
  priorityContainer: {
    marginRight: 4,
  },
  deleteButton: {
    backgroundColor: '#ff5252',
    borderRadius: 6,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskItem;
