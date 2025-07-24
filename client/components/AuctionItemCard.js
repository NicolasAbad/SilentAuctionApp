import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function AuctionItemCard({ item, timeLeft, isAdmin, onDelete, onPress }) {
  const isTimeOver = !timeLeft || timeLeft === '00:00' || timeLeft === '00:00:00' || timeLeft.startsWith('-');
  const displayStatus = isTimeOver ? 'Finished' : (item.status || 'N/A');
  const isActive = displayStatus.toLowerCase() === 'active';

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
          <View style={styles.imageWrapper}>
      {item.imageBase64 ? (
        <Image source={{ uri: item.imageBase64 }} style={styles.cardImage} resizeMode="cover" />
      ) : item.imageUrls && item.imageUrls.length > 0 ? (
        <Image source={{ uri: item.imageUrls[0] }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <View style={[styles.statusBadge, isActive ? styles.activeBadge : styles.finishedBadge]}>
        <Text style={styles.statusText}>{displayStatus}</Text>
      </View>
</View>

      <View style={styles.content}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>

        <Text style={styles.cardText}>
          <Text style={styles.cardLabel}>Starting Bid: </Text>${item.startingBid || 0}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.cardLabel}>Current Bid: </Text>${item.currentBid || 0}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.cardLabel}>Category: </Text>{item.category || 'N/A'}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.cardLabel}>Time Left: </Text>{timeLeft || '--:--'}
        </Text>
      </View>

      {isAdmin && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item._id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: '47%',
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  imageWrapper: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 130,
  },
  noImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#888',
    fontSize: 14,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  finishedBadge: {
    backgroundColor: '#D32F2F',
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    marginBottom: 3,
    color: '#444',
  },
  cardLabel: {
    fontWeight: 'bold',
    color: '#222',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
