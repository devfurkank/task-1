import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <TouchableOpacity onPress={() => onToggle(task.id)}>
      <View style={[styles.taskItem, task.completed && styles.completedTask]}>
        <View style={styles.taskContent}>
          <View style={[styles.checkbox, task.completed && styles.checkedBox]}>
            {task.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={[styles.taskText, task.completed && styles.completedTaskText]}>
            {task.title}
          </Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task.id)}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a86f7',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#4a86f7',
  },
  completedTask: {
    backgroundColor: '#f8f9fa',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    backgroundColor: '#ff5252',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskItem;
