
import BottomNavBar from './BottomNavBar.js'; 
import TopBar from './TopBar';

import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const items = [
  {
    id: '1',
    title: 'Vintage Camera',
    bid: '$200',
    time: '3h',
    image: require('../assets/icon.jpg'),
  },
  {
    id: '2',
    title: 'Leather Bag',
    bid: '$120',
    time: '1h',
    image: require('../assets/icon.jpg'),
  },
  {
    id: '3',
    title: 'Modern Clock',
    bid: '$75',
    time: '45m',
    image: require('../assets/icon.jpg'),
  },
  {
    id: '4',
    title: 'Wireless Headphones',
    bid: '$150',
    time: '2h 10m',
    image: require('../assets/icon.jpg'),
  },
];

export default function HomeScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>Current bid <Text style={styles.cardBold}>{item.bid}</Text></Text>
      <Text style={styles.cardText}>Time left {item.time}</Text>
    </View>
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
    resizeMode: 'cover',
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
});
