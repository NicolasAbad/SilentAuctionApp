import BottomNavBar from './BottomNavBar.js'; 
import TopBar from './TopBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';

import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [timeLeftMap, setTimeLeftMap] = useState({});
  const API_URL = Constants.expoConfig.extra.API_URL;

  // Time formatter for countdown timer
  function formatTimeLeft(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
  }

  // Calculate time left every second for each item
  useEffect(() => {
    if (items.length === 0) return; // nothing to update

    const interval = setInterval(() => {
      const now = Date.now();
      const updated = {};
      items.forEach(item => {
        // endTime is expected to be ISO string or Date object
        const endTimeMs = new Date(item.endTime).getTime();
        const secondsLeft = Math.max(0, Math.floor((endTimeMs - now) / 1000));
        updated[item._id] = formatTimeLeft(secondsLeft);
      });
      setTimeLeftMap(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

  // Fetch items from backend on mount
  useEffect(() => {
    axios
      .get(`${API_URL}/api/items`) // Your backend API endpoint
      .then((res) => {
        setItems(res.data);
        
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
        Alert.alert('Error', 'Failed to fetch items');
      });
  }, []);

  // Render each item card
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ItemDetail', { item })}
    >
      {/* Show first image or fallback */}
      {item.imageUrls && item.imageUrls.length > 0 ? (
        <Image
          source={{ uri: item.imageUrls[0] }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.cardImage, {backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'}]}>
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
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <TopBar navigation={navigation} />

      {/* Search + Filter */}
      <View style={styles.searchRow}>
        <TextInput placeholder="Search" style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Create Auction Button */}
      <TouchableOpacity 
        style={styles.testButton}
        onPress={() => navigation.navigate('CreateAuction')}
      >
        <Text style={styles.testButtonText}>Go to create test page</Text>
      </TouchableOpacity>

      {/* FlatList */}
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={renderItem}
      />

      {/* Bottom Nav */}
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
});
