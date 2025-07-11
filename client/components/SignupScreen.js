import{ useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { auth } from '../src/firebaseconfig';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleSignup = async () => {
    if(!email || !password || !name || !password || !confirmPassword) {
      alert('Please fill all your fields!');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Login');
    } catch (error) {
      // TODO: Handle signup errors (email already in use, weak password, etc.)
      console.error('Signup error:', error.message);
      alert(error.message);
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://img.icons8.com/ios-filled/100/gavel.png' }}
        style={styles.icon}
      />

      <Text style={styles.appName}>SilentBid</Text>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginPrompt}>
          Already have an account? <Text style={styles.loginLink}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
  icon: { width: 60, height: 60, alignSelf: 'center' },
  appName: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  title: { fontSize: 26, fontWeight: 'bold', marginVertical: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  signupButton: {
    backgroundColor: '#F4511E',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  signupText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginPrompt: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
  loginLink: {
    color: '#F4511E',
    fontWeight: 'bold',
  },
});
