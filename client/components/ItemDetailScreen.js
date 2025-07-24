import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';
import Constants from 'expo-constants';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

export default function ItemDetailScreen({ route, navigation }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { item } = route.params;
  const [currentBid, setCurrentBid] = useState(item.currentBid || 0);
  const API_URL = Constants.expoConfig.extra.API_URL;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const endTimeMs = new Date(item.endTime).getTime();
      const remaining = Math.max(0, Math.floor((endTimeMs - now) / 1000));
      setTimeLeft(formatTime(remaining));
    }, 1000);

    return () => clearInterval(interval);
  }, [item.endTime]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
  };

  // Determine status badge info
  const isTimeOver = !timeLeft || timeLeft === '00:00' || timeLeft === '00:00:00' || timeLeft.startsWith('-');
  const displayStatus = isTimeOver ? 'Finished' : (item.status || 'N/A');
  const isActive = displayStatus.toLowerCase() === 'active';

  const placeBid = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Not logged in', 'You must be logged in to place a bid.');
        return;
      }
      const idToken = await user.getIdToken();

      if (!bidAmount || isNaN(bidAmount)) {
        Alert.alert('Invalid bid', 'Please enter a valid bid amount.');
        return;
      }

      if (parseFloat(bidAmount) <= currentBid) {
        Alert.alert('Bid too low', 'Your bid must be higher than the current bid.');
        return;
      }

      if (!item?._id) {
        Alert.alert('Error', 'Invalid item selected');
        return;
      }

      console.log('Placing bid for item ID:', item._id, 'with amount:', bidAmount);

      const response = await axios.post(
        `${API_URL}/api/bids/${item._id}/bid`,
        { amount: bidAmount },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      Alert.alert('Success', response.data.message || 'Bid placed successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setModalVisible(false);
            setBidAmount('');
            navigation.navigate('Home'); // 👈 Navigate to home
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to place bid. Please try again.'
      );
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        {/* Top Header */}
        <TopBar navigation={navigation} />

        {/* Main Body */}
        <ScrollView contentContainerStyle={styles.body}>
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/150' }}
              style={styles.image}
            />
            <View style={[styles.statusBadge, isActive ? styles.activeBadge : styles.finishedBadge]}>
              <Text style={styles.statusText}>{displayStatus}</Text>
            </View>
          </View>

          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.description}>
            {item.description ||
              'Classic 35mm film camera in excellent condition with a 50mm f/1.8 lens. Perfect for collectors or photography enthusiasts.'}
          </Text>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>Current bid</Text>
              <Text style={styles.value}>${currentBid.toFixed(2)}</Text>
            </View>
            <View>
              <Text style={styles.label}>Time left</Text>
              <Text style={styles.value}>{timeLeft}</Text>
            </View>
          </View>

          <Text style={styles.inputLabel}>Your Bid</Text>
          <TextInput
            style={styles.bidInput}
            placeholder="Enter your bid amount"
            keyboardType="numeric"
            value={bidAmount}
            onChangeText={setBidAmount}
          />

          <TouchableOpacity
            style={styles.bidButton}
            onPress={() => setModalVisible(true)}
            disabled={!isActive} // Disable if auction finished
          >
            <Text style={styles.bidText}>Place Bid</Text>
          </TouchableOpacity>

          {!isActive && (
            <Text style={styles.auctionClosedText}>This auction is finished. Bidding is closed.</Text>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavBar navigation={navigation} />

        {/* Confirm Bid Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Place bid?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to place this bid of ${parseFloat(bidAmount).toFixed(2)}?
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={placeBid}
                >
                  <Text style={styles.confirmText}>Place Bid</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    padding: 20,
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 10,
    zIndex: 10,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  finishedBadge: {
    backgroundColor: '#D32F2F',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#444',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  label: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  value: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
    color: '#333',
  },
  bidInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    textAlign: 'center',
  },
  bidButton: {
    backgroundColor: '#F4511E',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  bidText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  auctionClosedText: {
    color: '#D32F2F',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: 280,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#F4511E',
  },
  confirmButton: {
    backgroundColor: '#F4511E',
  },
  cancelText: {
    color: '#F4511E',
    fontWeight: '600',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
