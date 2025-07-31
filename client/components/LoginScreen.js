import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { auth } from '../firebase/config'; // ✅ Ensure this points to your config

import AsyncStorage from '@react-native-async-storage/async-storage';



export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); // ✅ Token to send to backend
  
      // You can store it with async storage if needed
      // await AsyncStorage.setItem('token', token);
       
      
        navigation.navigate('Home', { email, token });
      
  
    } catch (error) {
      console.error('Login error:', error.message);
      alert('Login failed: ' + error.message);
    }
  };
 
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.jpg')} style={styles.icon} />
      <Text style={styles.title}>Log in</Text>

      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or continue with</Text>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <Text>🔵 Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text>⚫ Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signup}>
          Don’t have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
  icon: { width: 80, height: 80, alignSelf: 'center', marginBottom: 10, resizeMode: 'contain' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  forgot: {
    fontSize: 13,
    color: '#F4511E',
    textAlign: 'right',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#F4511E',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: { textAlign: 'center', marginVertical: 10, color: '#666' },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  signup: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  signupLink: {
    color: '#F4511E',
    fontWeight: 'bold',
  },
});
