/**
 * CategorySelector Bileşeni
 * 
 * Görev oluştururken kategori seçmek için kullanılır.
 * Farklı kategorileri temsil eden chip'ler gösterir.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

// Kullanılabilir kategoriler ve renkleri
const CATEGORIES = [
  { id: 'genel', label: 'Genel', color: '#4a86f7' },
  { id: 'is', label: 'İş', color: '#f44336' },
  { id: 'kisisel', label: 'Kişisel', color: '#4caf50' },
  { id: 'alisveris', label: 'Alışveriş', color: '#ff9800' },
  { id: 'saglik', label: 'Sağlık', color: '#9c27b0' }
];

/**
 * @param {Object} props - Bileşen özellikleri
 * @param {string} props.selectedCategory - Seçili kategori ID'si
 * @param {Function} props.onSelectCategory - Kategori seçildiğinde çağrılan fonksiyon
 */
const CategorySelector = ({ selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      {/* Tüm kategorileri döngüyle chip olarak göster */}
      {CATEGORIES.map(category => (
        <Chip
          key={category.id}
          selected={selectedCategory === category.id}
          onPress={() => onSelectCategory(category.id)}
          style={[
            styles.chip,
            // Seçiliyse arka plan rengini değiştir
            { backgroundColor: selectedCategory === category.id ? category.color : 'transparent' }
          ]}
          // Seçiliyse metin rengini beyaz yap, değilse kategori renginde göster
          textStyle={{ color: selectedCategory === category.id ? 'white' : category.color }}
        >
          {category.label}
        </Chip>
      ))}
    </View>
  );
};

// Bileşen stilleri
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Çok fazla kategori varsa alt satıra geçer
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  chip: {
    margin: 4,
    borderWidth: 1,
  }
});

export default CategorySelector;
