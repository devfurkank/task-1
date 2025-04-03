/**
 * CategoryFilter Bileşeni
 * 
 * Ana ekranda görevleri belirli bir kategoriye göre filtrelemek için kullanılır.
 * Yatay kaydırılabilir bir kategori listesi sunar.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

// Filtre kategorileri (tümü seçeneği dahil)
const CATEGORIES = [
  { id: 'all', label: 'Tümü', color: '#757575' },
  { id: 'genel', label: 'Genel', color: '#4a86f7' },
  { id: 'is', label: 'İş', color: '#f44336' },
  { id: 'kisisel', label: 'Kişisel', color: '#4caf50' },
  { id: 'alisveris', label: 'Alışveriş', color: '#ff9800' },
  { id: 'saglik', label: 'Sağlık', color: '#9c27b0' }
];

/**
 * @param {Object} props - Bileşen özellikleri
 * @param {string} props.selectedFilter - Seçili filtre kategorisi ID'si
 * @param {Function} props.onSelectFilter - Filtre seçildiğinde çağrılan fonksiyon
 */
const CategoryFilter = ({ selectedFilter, onSelectFilter }) => {
  return (
    // Yatay kaydırılabilir kategori filtresi
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} // Kaydırma çubuğunu gizle
      contentContainerStyle={styles.container}
    >
      {/* Tüm kategorileri döngüyle chip olarak göster */}
      {CATEGORIES.map(category => (
        <Chip
          key={category.id}
          selected={selectedFilter === category.id}
          onPress={() => onSelectFilter(category.id)}
          style={[
            styles.chip,
            // Seçiliyse arka plan rengini değiştir
            { backgroundColor: selectedFilter === category.id ? category.color : 'transparent' }
          ]}
          // Seçiliyse metin rengini beyaz yap, değilse kategori renginde göster
          textStyle={{ color: selectedFilter === category.id ? 'white' : category.color }}
        >
          {category.label}
        </Chip>
      ))}
    </ScrollView>
  );
};

// Bileşen stilleri
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  chip: {
    marginHorizontal: 4,
    borderWidth: 1,
  }
});

export default CategoryFilter;
