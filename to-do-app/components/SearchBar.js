/**
 * SearchBar Bileşeni
 * 
 * Görevlerde arama yapmak için kullanılan arama çubuğu.
 * React Native Paper'ın Searchbar bileşenini kullanır.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

/**
 * @param {Object} props - Bileşen özellikleri
 * @param {string} props.searchQuery - Arama metni
 * @param {Function} props.onChangeSearch - Arama metni değiştiğinde çağrılan fonksiyon
 */
const SearchBar = ({ searchQuery, onChangeSearch }) => {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Görevlerde ara..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#4a86f7" // Arama ikonu rengi
      />
    </View>
  );
};

// Bileşen stilleri
const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 5,
  },
  searchBar: {
    borderRadius: 10,
    elevation: 1, // Android için hafif gölge
  }
});

export default SearchBar;
