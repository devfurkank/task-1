/**
 * Günlük Planlayıcı Uygulaması - Ana Uygulama Bileşeni
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';
import { Appbar, Text, Modal, Chip } from 'react-native-paper';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import { 
  scheduleTaskReminder, 
  scheduleDailyReminder, 
  addNotificationResponseListener 
} from './utils/notificationUtils';

// Tema renkleri
const COLORS = {
  primary: '#4a86f7',
  background: '#f5f9ff',
  card: '#ffffff',
  text: '#333333',
  border: '#e1e4e8'
};

export default function App() {
  // State tanımlamaları
  const [tasks, setTasks] = useState([]);         // Görevler listesi
  const [loading, setLoading] = useState(true);   // Yükleme durumu
  const [searchQuery, setSearchQuery] = useState(''); // Arama metni
  const [categoryFilter, setCategoryFilter] = useState('all'); // Kategori filtresi
  const [sortBy, setSortBy] = useState('date-asc'); // Sıralama yöntemi
  const [showSortModal, setShowSortModal] = useState(false); // Sıralama modalı
  
  // Bildirim dinleyici referansı
  const notificationListener = useRef();

  // Görevleri cihazdan yükleme fonksiyonu
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('TASKS');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log('Görevleri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Görevleri cihaza kaydetme fonksiyonu
  const saveTasks = async (tasksToSave) => {
    try {
      await AsyncStorage.setItem('TASKS', JSON.stringify(tasksToSave));
    } catch (error) {
      console.log('Görevleri kaydetme hatası:', error);
    }
  };

  // Uygulama başlatıldığında görevleri yükle ve bildirim dinleyici ekle
  useEffect(() => {
    loadTasks();
    
    // Bildirime tıklandığında yapılacak işlemler
    notificationListener.current = addNotificationResponseListener(data => {
      if (data.taskId) {
        console.log('Görev bildirime tıklandı:', data.taskId);
        // İlgili göreve odaklanabilir veya ekranda gösterebilirsiniz
      }
    });
    
    // Component unmount olduğunda
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
    };
  }, []);
  
  // Görev listesi değiştiğinde görevleri kaydet ve bildirimleri planla
  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
      
      // Görevler için son tarih bildirimleri planla
      tasks.forEach(task => {
        if (task.dueDate && !task.completed) {
          scheduleTaskReminder(task);
        }
      });
      
      // Günlük özet bildirimi planla
      scheduleDailyReminder(tasks);
    }
  }, [tasks, loading]);

  // Arama ve filtreleme sonuçlarını getir
  const getFilteredTasks = () => {
    return tasks
      .filter(task => {
        // Arama filtrelemesi
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Kategori filtrelemesi
        const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // Sıralama işlemi
        if (sortBy === 'date-asc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === 'date-desc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        } else if (sortBy === 'priority') {
          const priorityOrder = { high: 0, normal: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0;
      });
  };

  // Yeni görev ekleme fonksiyonu
  const addTask = (text, category = 'genel', dueDate = null, priority = 'normal') => {
    const newTask = { 
      id: Date.now().toString(), 
      title: text.trim(),
      completed: false,
      createdAt: new Date(),
      category,
      dueDate,
      priority
    };
    setTasks([...tasks, newTask]); // Sıralama: yeni görevler sona eklenir
  };

  // Görev tamamlama fonksiyonu
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Görev silme fonksiyonu
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            {/* Başlık Çubuğu */}
            <Appbar.Header>
              <Appbar.Content title="Günlük Planlayıcı" />
              <Appbar.Action icon="sort" onPress={() => setShowSortModal(true)} />
            </Appbar.Header>
            
            {/* Arama Çubuğu */}
            <SearchBar 
              searchQuery={searchQuery} 
              onChangeSearch={setSearchQuery} 
            />
            
            {/* Kategori Filtreleme */}
            <CategoryFilter 
              selectedFilter={categoryFilter} 
              onSelectFilter={setCategoryFilter} 
            />
            
            {/* Görev Listesi */}
            <View style={styles.content}>
              <TaskList 
                tasks={getFilteredTasks()} 
                onToggleTask={toggleTaskCompletion} 
                onDeleteTask={deleteTask} 
              />
            </View>
            
            {/* Görev Ekleme Formu */}
            <TaskForm onAddTask={addTask} />
            
            {/* Sıralama Seçenekleri Modalı */}
            <Modal 
              visible={showSortModal} 
              onDismiss={() => setShowSortModal(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <Text style={styles.modalTitle}>Sıralama Seçenekleri</Text>
              <Chip 
                selected={sortBy === 'date-asc'} 
                onPress={() => {
                  setSortBy('date-asc');
                  setShowSortModal(false);
                }}
                style={styles.chip}
              >
                Tarihe göre (Yakından uzağa)
              </Chip>
              <Chip 
                selected={sortBy === 'date-desc'} 
                onPress={() => {
                  setSortBy('date-desc');
                  setShowSortModal(false);
                }}
                style={styles.chip}
              >
                Tarihe göre (Uzaktan yakına)
              </Chip>
              <Chip 
                selected={sortBy === 'priority'} 
                onPress={() => {
                  setSortBy('priority');
                  setShowSortModal(false);
                }}
                style={styles.chip}
              >
                Önceliğe göre
              </Chip>
            </Modal>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chip: {
    marginVertical: 5,
  }
});
