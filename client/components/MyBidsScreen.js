import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';
import BottomNavBar from './BottomNavBar';
import TopBar from './TopBar';

export default function MyBidsScreen({ navigation, route }) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig.extra.API_URL;
  const isAdmin = route?.params?.isAdmin || false;

  const filterLatestBidsPerItem = (bids) => {
    const latestBidsMap = new Map();
    bids.forEach((bid) => {
      const itemId = bid.item._id || bid.item;
      const existing = latestBidsMap.get(itemId);
      if (!existing || new Date(bid.createdAt) > new Date(existing.createdAt)) {
        latestBidsMap.set(itemId, bid);
      }
    });
    return Array.from(latestBidsMap.values());
  };

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Not logged in', 'Please log in to view your bids.');
          navigation.navigate('Account');
          return;
        }

        const idToken = await user.getIdToken();
        const response = await axios.get(`${API_URL}/api/bids/mybids`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        let allBids = Array.isArray(response.data) ? response.data : response.data.bids || [];
        const filteredBids = filterLatestBidsPerItem(allBids);
        setBids(filteredBids);
      } catch (error) {
        console.error('Error fetching bids:', error);
        Alert.alert('Error', 'Could not load your bids.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4511E" />
      </SafeAreaView>
    );
  }

  const bidsWhereCurrent = bids.filter((bid) => bid.amount === bid.item.currentBid);
  const bidsWhereNotCurrent = bids.filter((bid) => bid.amount !== bid.item.currentBid);

  const getImageSource = (item) => {
    if (!item) return 'https://via.placeholder.com/150';
    if (item.imageBase64) return { uri: `data:image/jpeg;base64,${item.imageBase64}` };
    if (item.imageUrls?.length) return { uri: item.imageUrls[0] };
    return { uri: 'https://via.placeholder.com/150' };
  };

  const renderItem = ({ item }) => {
    const bidItem = item.item;
    if (!bidItem) return null;

    return (
      <TouchableOpacity
        style={styles.bidCard}
        onPress={() => navigation.navigate('ItemDetail', { item: bidItem })}
      >
        <Image
          source={getImageSource(bidItem)}
          style={styles.image}
        />
        <View style={styles.bidInfo}>
          <Text style={styles.itemTitle}>{bidItem.title}</Text>
          <Text>Your bid: ${item.amount?.toFixed(2) || '0.00'}</Text>
          <Text>Current bid: ${bidItem.currentBid?.toFixed(2) || '0.00'}</Text>
          <Text>Ends: {new Date(bidItem.endTime).toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar navigation={navigation} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bids Where You Are Current Highest</Text>
          {bidsWhereCurrent.length === 0 ? (
            <Text style={styles.noBidsText}>No items where your bid is the highest.</Text>
          ) : (
            <FlatList
              data={bidsWhereCurrent}
              keyExtractor={(bid) => bid._id}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bids Where You Are Outbid</Text>
          {bidsWhereNotCurrent.length === 0 ? (
            <Text style={styles.noBidsText}>No items where you have been outbid.</Text>
          ) : (
            <FlatList
              data={bidsWhereNotCurrent}
              keyExtractor={(bid) => bid._id}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      <BottomNavBar navigation={navigation} isAdmin={isAdmin} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noBidsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    paddingLeft: 8,
  },
  bidCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  bidInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});
