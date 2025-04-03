/**
 * Günlük Planlayıcı Uygulaması - Ana Uygulama Bileşeni
 * 
 * Bu dosya uygulamanın ana giriş noktasıdır. Tüm bileşenleri bir araya getirir,
 * uygulama durumunu (state) yönetir ve veri akışını koordine eder.
 */

import React, { useState, useEffect } from 'react';
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
import { scheduleTaskReminder, scheduleDailyReminder } from './utils/notificationUtils';

export default function App() {
  // =============== STATE TANIMLARI ===============
  // Görevleri tutan ana state
  const [tasks, setTasks] = useState([]);
  
  // Uygulama yüklenme durumu
  const [loading, setLoading] = useState(true);
  
  // Arama sorgusu state'i
  const [searchQuery, setSearchQuery] = useState('');
  
  // Kategori filtresi state'i, başlangıçta tüm görevleri gösterir
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Sıralama seçeneği state'i, başlangıçta tarihe göre artan sıralama
  const [sortBy, setSortBy] = useState('date-asc'); // 'date-asc', 'date-desc', 'priority'
  
  // Sıralama modalının görünürlük state'i
  const [showSortModal, setShowSortModal] = useState(false);

  // =============== TEMEL FONKSİYONLAR ===============
  
  /**
   * Görevleri cihaz hafızasından yükler
   * Uygulama ilk açıldığında çalışır
   */
  const loadTasks = async () => {
    try {
      // AsyncStorage'dan görevleri oku
      const storedTasks = await AsyncStorage.getItem('TASKS');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log('Görevleri yükleme hatası:', error);
    } finally {
      // Yükleme tamamlandı
      setLoading(false);
    }
  };

  /**
   * Görevleri cihaz hafızasına kaydeder
   * @param {Array} tasksToSave - Kaydedilecek görevler dizisi
   */
  const saveTasks = async (tasksToSave) => {
    try {
      // Görevleri JSON formatına çevirip AsyncStorage'a kaydet
      await AsyncStorage.setItem('TASKS', JSON.stringify(tasksToSave));
    } catch (error) {
      console.log('Görevleri kaydetme hatası:', error);
    }
  };

  // =============== LIFECYCLE HOOKS (YAŞAM DÖNGÜSÜ) ===============
  
  // Uygulama başlatıldığında görevleri yükle
  useEffect(() => {
    loadTasks();
  }, []);
  
  // Görev listesi değiştiğinde görevleri kaydet ve bildirimleri planla
  useEffect(() => {
    if (!loading) {
      // Görevleri kaydet
      saveTasks(tasks);
      
      // Her bir görev için son tarih bildirimi oluştur
      tasks.forEach(task => {
        if (task.dueDate && !task.completed) {
          scheduleTaskReminder(task);
        }
      });
      
      // Günlük özet bildirimi oluştur
      scheduleDailyReminder(tasks);
    }
  }, [tasks, loading]);

  // =============== GÖREVLERİ YÖNETİM FONKSİYONLARI ===============
  
  /**
   * Filtreleme ve sıralama kriterlerine göre görevleri döndürür
   * @returns {Array} - Filtrelenmiş ve sıralanmış görevler dizisi
   */
  const getFilteredTasks = () => {
    return tasks
      .filter(task => {
        // Arama filtrelemesi - başlıkta arama yapın
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Kategori filtrelemesi - 'all' seçiliyse tüm kategorileri göster
        const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // Sıralama işlemi
        if (sortBy === 'date-asc') {
          // Yakın tarihleri üstte göster, tarihsiz görevler en sonda
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === 'date-desc') {
          // Uzak tarihleri üstte göster, tarihsiz görevler en sonda
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        } else if (sortBy === 'priority') {
          // Yüksek öncelikli görevleri üstte göster
          const priorityOrder = { high: 0, normal: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0;
      });
  };

  /**
   * Yeni görev ekler
   * @param {string} text - Görev başlığı
   * @param {string} category - Görev kategorisi
   * @param {Date|null} dueDate - Son tarih (opsiyonel)
   * @param {string} priority - Öncelik seviyesi
   */
  const addTask = (text, category = 'genel', dueDate = null, priority = 'normal') => {
    const newTask = { 
      id: Date.now().toString(),  // Benzersiz ID oluştur
      title: text.trim(),
      completed: false,
      createdAt: new Date(),
      category,
      dueDate,
      priority
    };
    setTasks([...tasks, newTask]); // Yeni görevi listeye ekle
  };

  /**
   * Görevi tamamlandı olarak işaretler veya işareti kaldırır
   * @param {string} taskId - Görev ID'si
   */
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } // İlgili görevin durumunu değiştir
        : task // Diğer görevleri olduğu gibi bırak
    ));
  };

  /**
   * Görevi siler
   * @param {string} taskId - Silinecek görevin ID'si
   */
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // =============== RENDER METODU ===============
  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* Durum çubuğu (Status Bar) */}
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        {/* Ekranın boş kısmına tıklandığında klavyeyi kapat */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            {/* Başlık çubuğu */}
            <Appbar.Header>
              <Appbar.Content title="Günlük Planlayıcı" />
              <Appbar.Action icon="sort" onPress={() => setShowSortModal(true)} />
            </Appbar.Header>
            
            {/* Arama çubuğu */}
            <SearchBar 
              searchQuery={searchQuery} 
              onChangeSearch={setSearchQuery} 
            />
            
            {/* Kategori filtre çubuğu */}
            <CategoryFilter 
              selectedFilter={categoryFilter} 
              onSelectFilter={setCategoryFilter} 
            />
            
            {/* Görev listesi */}
            <View style={styles.content}>
              <TaskList 
                tasks={getFilteredTasks()} 
                onToggleTask={toggleTaskCompletion} 
                onDeleteTask={deleteTask} 
              />
            </View>
            
            {/* Görev ekleme formu */}
            <TaskForm onAddTask={addTask} />
            
            {/* Sıralama seçenekleri modalı */}
            <Modal 
              visible={showSortModal} 
              onDismiss={() => setShowSortModal(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <Text style={styles.modalTitle}>Sıralama Seçenekleri</Text>
              
              {/* Sıralama seçenekleri */}
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

// =============== STİLLER ===============
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
