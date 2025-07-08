import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminCreateAuction({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!title || !startingBid || !duration || !image) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    // TODO: Send data to Firebase or backend API
    Alert.alert('Success', 'Auction created successfully!');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <View style={styles.container}>
      <TopBar navigation={navigation} />

      <Text style={styles.title}>Create New Auction</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>📸 Tap to upload image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Item Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />
      <TextInput
        placeholder="Starting Bid ($)"
        value={startingBid}
        onChangeText={setStartingBid}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Duration (e.g., 1h, 30m)"
        value={duration}
        onChangeText={setDuration}
        style={styles.input}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Create Auction</Text>
      </TouchableOpacity>

      <BottomNavBar navigation={navigation} />
    </View>
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#F4511E',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: '#eee',
    height: 160,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    color: '#888',
    fontSize: 14,
  },
});
