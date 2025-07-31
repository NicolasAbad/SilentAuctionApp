import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

import { auth } from '../firebase/config';

import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';

import SearchFilterBar from './SearchFilterBar';
import SortModal from './SortModal';
import AuctionItemCard from './AuctionItemCard';

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [timeLeftMap, setTimeLeftMap] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [sortVisible, setSortVisible] = useState(false);

  const API_URL = Constants.expoConfig.extra.API_URL;
  const ADMIN_EMAIL = Constants.expoConfig.extra.ADMIN_EMAIL?.toLowerCase();

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email && ADMIN_EMAIL) {
      setIsAdmin(user.email.toLowerCase() === ADMIN_EMAIL);
    } else {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (filteredItems.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const updated = {};
      filteredItems.forEach(item => {
        const endTimeMs = new Date(item.endTime).getTime();
        const secondsLeft = Math.max(0, Math.floor((endTimeMs - now) / 1000));
        updated[item._id] = formatTimeLeft(secondsLeft);
      });
      setTimeLeftMap(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [filteredItems]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [items, searchQuery, selectedCategory, selectedSort]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to fetch items');
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...items];

    if (selectedCategory !== '') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSort === 'priceAsc') {
      filtered.sort((a, b) => a.startingBid - b.startingBid);
    } else if (selectedSort === 'priceDesc') {
      filtered.sort((a, b) => b.startingBid - a.startingBid);
    } else if (selectedSort === 'timeLeft') {
      filtered.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
    } else if (selectedSort === 'latestFirst') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredItems(filtered);
  };

  const formatTimeLeft = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
  };

  const handleDelete = (itemId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteItem(itemId) },
      ],
      { cancelable: true }
    );
  };

  const deleteItem = async (itemId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Not logged in', 'Please log in to delete items.');
        return;
      }

      const idToken = await user.getIdToken();

      await axios.delete(`${API_URL}/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
        timeout: 10000,
      });

      setItems(prevItems => prevItems.filter(item => item._id !== itemId));
      Alert.alert('Deleted', 'Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />

      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSortPress={() => setSortVisible(true)}
      />

      <SortModal
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <AuctionItemCard
            item={item}
            timeLeft={timeLeftMap[item._id]}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onPress={() => navigation.navigate('ItemDetail', { item })}
          />
        )}
      />

      <BottomNavBar navigation={navigation} isAdmin={isAdmin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 50 },
  adminButton: {
    backgroundColor: '#1E88E5',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
