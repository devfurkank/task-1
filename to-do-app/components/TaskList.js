/**
 * TaskList Bileşeni
 * 
 * Görevleri listeleyen bileşen. Eğer liste boşsa özel bir mesaj gösterir.
 */

import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';

/**
 * @param {Object} props - Bileşen özellikleri
 * @param {Array} props.tasks - Gösterilecek görevler dizisi
 * @param {Function} props.onToggleTask - Görev tamamlama durumu değiştiğinde çağrılan fonksiyon
 * @param {Function} props.onDeleteTask - Görev silindiğinde çağrılan fonksiyon
 */
const TaskList = ({ tasks, onToggleTask, onDeleteTask }) => {
  // Görev listesi boşsa özel bir mesaj göster
  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz görev eklenmedi</Text>
        <Text style={styles.emptySubText}>Yeni bir görev eklemek için aşağıdaki formu kullanın</Text>
      </View>
    );
  }

  // Görevleri FlatList içinde göster
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id} // Her görev için benzersiz anahtar
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      )}
      style={styles.list}
      showsVerticalScrollIndicator={false} // Kaydırma çubuğunu gizle
    />
  );
};

// Bileşen stilleri
const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingHorizontal: 15,
  },
  // Boş liste durumu için stiller
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  }
});

export default TaskList;
