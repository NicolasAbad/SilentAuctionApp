
import { View, Text, StyleSheet } from 'react-native';
import BottomNavBar from './BottomNavBar.js'; 
import TopBar from './TopBar';

export default function AccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
       <TopBar navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.text}>Name: John Doe</Text>
        <Text style={styles.text}>Email: john@example.com</Text>
      </View>

      <BottomNavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#444', marginVertical: 4 },
});
