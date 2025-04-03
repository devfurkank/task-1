/**
 * PrioritySelector Bileşeni
 * 
 * Görev eklerken öncelik seviyesi seçmek için kullanılır.
 * Düşük, Normal ve Yüksek öncelik seçeneklerini sunar.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

// Öncelik seviyeleri ve renkleri
const PRIORITIES = [
  { id: 'low', label: 'Düşük', color: '#4caf50' },    // Yeşil
  { id: 'normal', label: 'Normal', color: '#2196f3' }, // Mavi
  { id: 'high', label: 'Yüksek', color: '#f44336' }    // Kırmızı
];

/**
 * @param {Object} props - Bileşen özellikleri
 * @param {string} props.selectedPriority - Seçili öncelik ID'si
 * @param {Function} props.onSelectPriority - Öncelik seçildiğinde çağrılan fonksiyon
 */
const PrioritySelector = ({ selectedPriority, onSelectPriority }) => {
  return (
    <View style={styles.container}>
      {/* Tüm öncelikleri döngüyle chip olarak göster */}
      {PRIORITIES.map(priority => (
        <Chip
          key={priority.id}
          selected={selectedPriority === priority.id}
          onPress={() => onSelectPriority(priority.id)}
          style={[
            styles.chip,
            // Seçiliyse arka plan rengini değiştir
            { backgroundColor: selectedPriority === priority.id ? priority.color : 'transparent' }
          ]}
          // Seçiliyse metin rengini beyaz yap, değilse öncelik renginde göster
          textStyle={{ color: selectedPriority === priority.id ? 'white' : priority.color }}
        >
          {priority.label}
        </Chip>
      ))}
    </View>
  );
};

// Bileşen stilleri
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Eşit aralıklı dağıt
    marginVertical: 8,
  },
  chip: {
    flex: 1, // Tüm genişliği kullan ve eşit böl
    marginHorizontal: 4,
    borderWidth: 1,
  }
});

export default PrioritySelector;
