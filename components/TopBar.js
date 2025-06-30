import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function TopBar({ navigation }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleLogout = () => {
    // TODO: Add Firebase signOut logic
    navigation.navigate('Login');
  };

  return (
    <View style={styles.wrapper}>
      
      <TouchableOpacity style={styles.gearButton} onPress={toggleMenu}>
        <Text style={styles.gearIcon}>⚙️</Text>
      </TouchableOpacity>

     
      <View style={styles.centeredRow}>
        <Image source={require('../assets/icon.jpg')} style={styles.logo} />
        <Text style={styles.appName}>SilentBid</Text>
      </View>

      
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.menuItem}>Log out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    marginBottom: 10,
    position: 'relative',
    alignItems: 'center',
  },
  centeredRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  gearButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  gearIcon: {
    fontSize: 24,
  },
  menu: {
    position: 'absolute',
    top: 45,
    right: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    zIndex: 10,
  },
  menuItem: {
    fontSize: 16,
    color: '#F4511E',
  },
});
