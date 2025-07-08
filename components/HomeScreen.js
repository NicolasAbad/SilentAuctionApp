
import BottomNavBar from './BottomNavBar.js'; 
import TopBar from './TopBar';
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const rawItems = [
  {
    id: '1',
    title: 'Vintage Camera',
    description: 'Classic 35mm film camera in excellent condition.',
    isActive: true,
    startTime: Date.now(),
    duration: '3h',
    endTime: Date.now() + 3 * 60 * 60 * 1000,
    bidHistory: [
      { userId: 'u1', amount: 210, timestamp: Date.now() - 600000 },
      { userId: 'u2', amount: 220, timestamp: Date.now() - 300000 },
    ],
    currentBid: 220,
    image: require('../assets/icon.jpg'),
    tags: ['electronics', 'camera', 'vintage'],
  },
  {
    id: '2',
    title: 'Leather Bag',
    description: 'Premium leather handbag with elegant design.',
    isActive: true,
    startTime: Date.now(),
    duration: '1h',
    endTime: Date.now() + 60 * 60 * 1000,
    bidHistory: [
      { userId: 'u3', amount: 100, timestamp: Date.now() - 400000 },
      { userId: 'u4', amount: 120, timestamp: Date.now() - 200000 },
    ],
    currentBid: 120,
    image: require('../assets/icon.jpg'),
    tags: ['fashion', 'accessories', 'leather'],
  },
  {
    id: '3',
    title: 'Modern Clock',
    description: 'Minimalist wall clock with silent mechanism.',
    isActive: true,
    startTime: Date.now(),
    duration: '45m',
    endTime: Date.now() + 45 * 60 * 1000,
    bidHistory: [
      { userId: 'u5', amount: 75, timestamp: Date.now() - 180000 },
    ],
    currentBid: 75,
    image: require('../assets/icon.jpg'),
    tags: ['home', 'decor', 'clock'],
  },
  {
    id: '4',
    title: 'Wireless Headphones',
    description: 'Noise-cancelling Bluetooth headphones with long battery life.',
    isActive: true,
    startTime: Date.now(),
    duration: '2h 10m',
    endTime: Date.now() + (2 * 60 + 10) * 60 * 1000,
    bidHistory: [
      { userId: 'u6', amount: 150, timestamp: Date.now() - 900000 },
    ],
    currentBid: 150,
    image: require('../assets/icon.jpg'),
    tags: ['electronics', 'audio', 'wireless'],
  },
];


export default function HomeScreen({ navigation }) {

  const [items, setItems] = useState([]);
  const [timeLeftMap, setTimeLeftMap] = useState({});

//this is the time formater
function formatTimeLeft(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;

}

useEffect(() => {
    const initialized = rawItems.map(item => ({
      ...item,
      endTime: parseDuration(item.duration),
    }));
    setItems(initialized);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updated = {};
      items.forEach(item => {
        const secondsLeft = Math.max(0, Math.floor((item.endTime - now) / 1000));
        updated[item.id] = formatTimeLeft(secondsLeft);
      });
      setTimeLeftMap(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [items]);


function parseDuration(duration = '') {
  const regex = /(?:(\d+)h)?\s*(?:(\d+)m)?/;
  const match = duration.match(regex);

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  return Date.now() + (hours * 60 + minutes) * 60 * 1000;
}


  const renderItem = ({ item }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() =>
  navigation.navigate('ItemDetail', {
    item: {
      ...item,
      endTime: item.endTime, 
    },
  })
}
  >
    <Image source={item.image} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.cardText}>Current bid <Text style={styles.cardBold}>{item.bid}</Text></Text>
    <Text style={styles.cardText}>
  Time left {timeLeftMap[item.id] || '--:--'}
    </Text>
  </TouchableOpacity>
); 

  return (

    <View style={styles.container}>


      {/* Header */}
      <TopBar navigation={navigation} />

      {/* main body */}
      <View style={styles.searchRow}>
        <TextInput placeholder="Search" style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>

        
      </View>

      {/* Test Button */}
      <TouchableOpacity 
        style={styles.testButton}
        onPress={() => navigation.navigate('CreateAuction')}
      >
        <Text style={styles.testButtonText}>Go to create test page</Text>
      </TouchableOpacity>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 24,
    marginRight: 5,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileIcon: {
    fontSize: 22,
  },
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
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  cardText: {
    fontSize: 13,
    color: '#444',
  },
  cardBold: {
    fontWeight: 'bold',
    color: '#000',
  },

  //temporary
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
