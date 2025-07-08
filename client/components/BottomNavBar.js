
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function BottomNavBar({ navigation }) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.navItem}>🏠 Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MyBids')}>
        <Text style={styles.navItem}>🔨 My Bids</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Account')}>
        <Text style={styles.navItem}>👤 Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#F5F5F5',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    fontSize: 16,
    color: '#333',
  },
});
