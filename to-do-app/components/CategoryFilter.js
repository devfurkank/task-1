/**
 * CategoryFilter Bileşeni - Dikdörtgen Buton Versiyonu
 * 
 * Ana ekranda görevleri belirli bir kategoriye göre filtrelemek için kullanılır.
 * Yatay kaydırılabilir kategori butonları sunar.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

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
    <View style={styles.wrapper}>
      {/* Yatay kaydırılabilir kategori filtresi */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} // Kaydırma çubuğunu gizle
        contentContainerStyle={styles.container}
      >
        {/* Tüm kategorileri döngüyle buton olarak göster */}
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectFilter(category.id)}
            style={[
              styles.categoryButton,
              { borderColor: category.color },
              selectedFilter === category.id && { backgroundColor: category.color }
            ]}
          >
            <Text 
              style={[
                styles.categoryText,
                { color: selectedFilter === category.id ? '#fff' : category.color }
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Gölge efekti için ekstra bir View */}
      <View style={styles.bottomShadow} />
    </View>
  );
};

// Bileşen stilleri
const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 6,
    position: 'relative',
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60, // Minimum genişlik ayarı
    height: 30,   // Sabit yükseklik
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e0e0e0',
  }
});

export default CategoryFilter;
