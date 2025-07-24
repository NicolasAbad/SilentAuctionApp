import BottomNavBar from './BottomNavBar.js';
import TopBar from './TopBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';

import { auth } from '../firebase/config';

import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [timeLeftMap, setTimeLeftMap] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const API_URL = Constants.expoConfig.extra.API_URL;
  const ADMIN_EMAIL = Constants.expoConfig.extra.ADMIN_EMAIL?.toLowerCase();

  // Check if logged-in user is admin by comparing emails
  useEffect(() => {
    const user = auth.currentUser;
   
    if (user?.email && ADMIN_EMAIL) {
      setIsAdmin(user.email.toLowerCase() === ADMIN_EMAIL);
    } else {
      setIsAdmin(false);
    }
  }, []);

  // Format remaining time
  const formatTimeLeft = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
  };

  // Update countdown timers every second
  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const updated = {};
      items.forEach(item => {
        const endTimeMs = new Date(item.endTime).getTime();
        const secondsLeft = Math.max(0, Math.floor((endTimeMs - now) / 1000));
        updated[item._id] = formatTimeLeft(secondsLeft);
      });
      setTimeLeftMap(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

  // Fetch auction items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to fetch items');
    }
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ItemDetail', { item })}
        style={{ flex: 1 }}
      >
        {item.imageUrls && item.imageUrls.length > 0 ? (
          <Image
            source={{ uri: item.imageUrls[0] }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cardImage, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
            <Text>No Image</Text>
          </View>
        )}

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardText}>{item.description}</Text>

        <Text style={styles.cardText}>
          Starting Bid: <Text style={styles.cardBold}>${item.startingBid || 0}</Text>
        </Text>
        <Text style={styles.cardText}>
          Current Bid: <Text style={styles.cardBold}>${item.currentBid || 0}</Text>
        </Text>
        <Text style={styles.cardText}>
          Category: <Text style={styles.cardBold}>{item.category || 'N/A'}</Text>
        </Text>
        <Text style={styles.cardText}>
          Status: <Text style={styles.cardBold}>{item.status || 'N/A'}</Text>
        </Text>
        <Text style={styles.cardText}>
          Time left: {timeLeftMap[item._id] || '--:--'}
        </Text>
      </TouchableOpacity>

      {isAdmin && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />

      <View style={styles.searchRow}>
        <TextInput placeholder="Search" style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {isAdmin && (
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => navigation.navigate('CreateAuction')}
        >
          <Text style={styles.testButtonText}>Go to create test page</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={renderItem}
      />

      <BottomNavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 50 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
  },
  filterButton: {
    backgroundColor: '#F4511E',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 10,
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    width: '47%',
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  cardBold: {
    fontWeight: 'bold',
    color: '#000',
  },
  testButton: {
    backgroundColor: '#1E88E5',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
