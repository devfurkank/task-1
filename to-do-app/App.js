import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

// Tema renkleri
const COLORS = {
  primary: '#4a86f7',
  background: '#f5f9ff',
  card: '#ffffff',
  text: '#333333',
  border: '#e1e4e8',
  error: '#ff5252',
  success: '#4caf50',
  completed: '#f8f9fa',
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Uygulama başlatıldığında görevleri yükle
  useEffect(() => {
    loadTasks();
  }, []);
  
  // Görev listesi değiştiğinde görevleri kaydet
  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  // Yeni görev ekleme fonksiyonu
  // Yeni görev ekleme fonksiyonu
const addTask = (text) => {
  const newTask = { 
    id: Date.now().toString(), 
    title: text.trim(),
    completed: false,
    createdAt: new Date()
  };
  setTasks([...tasks, newTask]);  // Değişiklik burada - yeni görev sona ekleniyor
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Günlük Planlayıcı</Text>
            <Text style={styles.subHeader}>
              {tasks.filter(t => !t.completed).length} görev kaldı
            </Text>
          </View>
          
          <TaskList 
            tasks={tasks} 
            onToggleTask={toggleTaskCompletion} 
            onDeleteTask={deleteTask} 
          />
          
          <TaskForm onAddTask={addTask} />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
});
