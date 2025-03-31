import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Alışveriş yap' },
    { id: '2', title: 'Spor yap' },
    { id: '3', title: 'Kitap oku' },
    { id: '4', title: 'Yemek yap' },
  ]);

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
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
    fontWeight:"bold",
    color: '#333',
  },
});
