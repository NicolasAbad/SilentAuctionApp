import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import axios from 'axios';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';

export default function AdminCreateAuction({ navigation, route }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const API_URL = Constants.expoConfig.extra.API_URL;
  const isAdmin = route?.params?.isAdmin || false;


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Parse duration string like "1h 30m" to an ISO string for endTime
  const parseDuration = (durationStr) => {
    const regex = /(?:(\d+)h)?\s*(?:(\d+)m)?/;
    const match = durationStr.match(regex);
    const hours = match?.[1] ? parseInt(match[1]) : 0;
    const minutes = match?.[2] ? parseInt(match[2]) : 0;
    return new Date(Date.now() + (hours * 60 + minutes) * 60 * 1000).toISOString();
  };

  const handleSubmit = async () => {
    if (!title || !startingBid || !duration || !image) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    try {
      const auth = getAuth();
      const idToken = await auth.currentUser.getIdToken();

      const newItem = {
        title,
        description,
        imageUrls: [image],
        startingBid: parseFloat(startingBid),
        category,  
        endTime: parseDuration(duration),
      };

      await axios.post(
        `${API_URL}/api/items`,
        newItem,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      Alert.alert('Success', 'Auction created successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error creating item:', error);
      Alert.alert('Error', 'Failed to create auction.');
    }
  };

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <TopBar navigation={navigation} />
    
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create New Auction</Text>

      {/* Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>📸 Tap to upload image</Text>
        )}
      </TouchableOpacity>

      {/* Inputs */}
      <TextInput placeholder="Item Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={[styles.input, { height: 80 }]} multiline />
      <TextInput placeholder="Starting Bid ($)" value={startingBid} onChangeText={setStartingBid} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Duration (e.g., 1h, 30m)" value={duration} onChangeText={setDuration} style={styles.input} />

      {/* Category Picker */}
      <Picker selectedValue={category} onValueChange={(value) => setCategory(value)} style={styles.input}>
        <Picker.Item label="Select a category..." value="" />
        <Picker.Item label="Electronics" value="electronics" />
        <Picker.Item label="Fashion" value="fashion" />
        <Picker.Item label="Home Decor" value="home_decor" />
        <Picker.Item label="Books" value="books" />
        <Picker.Item label="Sports & Outdoors" value="sports_outdoors" />
        <Picker.Item label="Toys & Games" value="toys_games" />
        <Picker.Item label="Collectibles" value="collectibles" />
        <Picker.Item label="Automotive" value="automotive" />
        <Picker.Item label="Health & Beauty" value="health_beauty" />
        <Picker.Item label="Jewelry & Watches" value="jewelry_watches" />
        <Picker.Item label="Music & Instruments" value="music_instruments" />
        <Picker.Item label="Office Supplies" value="office_supplies" />
        <Picker.Item label="Pet Supplies" value="pet_supplies" />
        <Picker.Item label="Garden & Outdoor" value="garden_outdoor" />
        <Picker.Item label="Industrial Equipment" value="industrial_equipment" />
        <Picker.Item label="Food & Beverage" value="food_beverage" />
      </Picker>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Create Auction</Text>
      </TouchableOpacity>
    </ScrollView>

    <BottomNavBar navigation={navigation} isAdmin={isAdmin} />
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
  scrollContainer: {
  padding: 20,
  paddingBottom: 80, 
}
});