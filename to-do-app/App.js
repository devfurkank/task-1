import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Alışveriş yap', completed: false },
    { id: '2', title: 'Spor yap', completed: false },
    { id: '3', title: 'Kitap oku', completed: false },
    { id: '4', title: 'Yemek yap', completed: false },
  ]);
  const [taskText, setTaskText] = useState('');

  // Yeni görev ekleme fonksiyonu
  const addTask = () => {
    if (taskText.trim().length > 0) {
      setTasks([...tasks, { 
        id: Date.now().toString(), 
        title: taskText.trim(),
        completed: false 
      }]);
      setTaskText('');
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.header}>Günlük Planlayıcı</Text>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.title}</Text>
          </View>
        )}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni görev ekle..."
          value={taskText}
          onChangeText={setTaskText}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskText: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
