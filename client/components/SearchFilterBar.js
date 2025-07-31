import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';

const categories = [
  { label: 'All Categories', value: '' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Home Decor', value: 'home_decor' },
  { label: 'Books', value: 'books' },
  { label: 'Sports & Outdoors', value: 'sports_outdoors' },
  { label: 'Toys & Games', value: 'toys_games' },
  { label: 'Collectibles', value: 'collectibles' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Health & Beauty', value: 'health_beauty' },
  { label: 'Jewelry & Watches', value: 'jewelry_watches' },
  { label: 'Music & Instruments', value: 'music_instruments' },
  { label: 'Office Supplies', value: 'office_supplies' },
  { label: 'Pet Supplies', value: 'pet_supplies' },
  { label: 'Garden & Outdoor', value: 'garden_outdoor' },
  { label: 'Industrial Equipment', value: 'industrial_equipment' },
  { label: 'Food & Beverage', value: 'food_beverage' },
];

export default function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSortPress,
}) {
  const onCategoryPress = () => {
    Alert.alert(
      'Select Category',
      null,
      [
        ...categories.map(cat => ({
          text: cat.label,
          onPress: () => setSelectedCategory(cat.value),
        })),
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by title"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="while-editing"
      />
      <TouchableOpacity style={styles.button} onPress={onCategoryPress}>
        <Text style={styles.buttonText}>
          {selectedCategory ? selectedCategory.replace(/_/g, ' ') : 'All Categories'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSortPress}>
        <Text style={styles.buttonText}>Sort</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  searchInput: { flex: 1, backgroundColor: '#F5F5F5', padding: 12, borderRadius: 12 },
  button: {
    backgroundColor: '#F4511E',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
