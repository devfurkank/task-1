/**
 * TaskForm Bileşeni
 * 
 * Yeni görev eklemek için form sunar. Basit bir metin girişi ve
 * gelişmiş ayarlar (kategori, son tarih, öncelik) için modal içerir.
 */

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from 'react-native-paper';
import CategorySelector from './CategorySelector';
import TaskDatePicker from './DateTimePicker';
import PrioritySelector from './PrioritySelector';

/**
 * @param {Object} props - Bileşen özellikleri
 * @param {Function} props.onAddTask - Görev eklendiğinde çağrılan fonksiyon
 */
const TaskForm = ({ onAddTask }) => {
  // Form durumları
  const [taskText, setTaskText] = useState('');         // Görev metni
  const [showModal, setShowModal] = useState(false);    // Modal görünürlüğü
  const [category, setCategory] = useState('genel');    // Seçili kategori
  const [dueDate, setDueDate] = useState(null);         // Son tarih
  const [priority, setPriority] = useState('normal');   // Öncelik seviyesi

  /**
   * Görev ekleme fonksiyonu
   * Metin kontrolü yaparak yeni görev ekler ve formu sıfırlar
   */
  const handleAddTask = () => {
    if (taskText.trim().length > 0) {
      onAddTask(taskText, category, dueDate, priority);
      resetForm();
    }
  };

  /**
   * Form alanlarını varsayılan değerlere sıfırlar
   */
  const resetForm = () => {
    setTaskText('');
    setCategory('genel');
    setDueDate(null);
    setPriority('normal');
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Temel Form - Görev Ekleme Alanı */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni görev ekle..."
          value={taskText}
          onChangeText={setTaskText}
        />
        {/* Detay Ayarlar Butonu */}
        <TouchableOpacity 
          style={styles.optionsButton} 
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="options-outline" size={24} color="#4a86f7" />
        </TouchableOpacity>
        {/* Görev Ekleme Butonu */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddTask}
          disabled={taskText.trim().length === 0} // Boş metinler için devre dışı bırak
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Detaylı Ayarlar Modalı */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Görev Detayları</Text>
            
            {/* Kategori Seçici */}
            <Text style={styles.sectionTitle}>Kategori</Text>
            <CategorySelector 
              selectedCategory={category} 
              onSelectCategory={setCategory} 
            />
            
            {/* Tarih Seçici */}
            <Text style={styles.sectionTitle}>Son Tarih</Text>
            <TaskDatePicker 
              date={dueDate} 
              onDateChange={setDueDate} 
            />
            
            {/* Öncelik Seçici */}
            <Text style={styles.sectionTitle}>Öncelik</Text>
            <PrioritySelector 
              selectedPriority={priority} 
              onSelectPriority={setPriority} 
            />
            
            {/* Modal Butonları */}
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={() => setShowModal(false)}
                style={styles.modalButton}
              >
                Kapat
              </Button>
              <Button 
                mode="contained" 
                onPress={handleAddTask}
                disabled={taskText.trim().length === 0}
                style={styles.modalButton}
              >
                Ekle
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Bileşen stilleri
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  optionsButton: {
    marginLeft: 8,
    padding: 8,
  },
  addButton: {
    backgroundColor: '#4a86f7',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Modal alt kısımdan açılır
    backgroundColor: 'rgba(0,0,0,0.5)', // Yarı saydam arka plan
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  }
});

export default TaskForm;
