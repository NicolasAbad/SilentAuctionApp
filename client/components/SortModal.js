import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const sortOptions = [
  { label: 'Price: Low to High', value: 'priceAsc' },
  { label: 'Price: High to Low', value: 'priceDesc' },
  { label: 'Time Left: Soonest First', value: 'timeLeft' },
  { label: 'Latest First', value: 'latestFirst' },
];

export default function SortModal({ visible, onClose, selectedSort, onSelectSort }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sort By</Text>

          {sortOptions.map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              onPress={() => {
                onSelectSort(value);
                onClose();
              }}
              style={[styles.modalOption, selectedSort === value && styles.modalOptionSelected]}
            >
              <Text style={[styles.modalOptionText, selectedSort === value && styles.modalOptionTextSelected]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={onClose} style={styles.modalCancelButton}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 5,
    marginBottom: 5,
  },
  modalOptionSelected: { backgroundColor: '#F4511E' },
  modalOptionText: { fontSize: 16, color: '#333' },
  modalOptionTextSelected: { color: 'white', fontWeight: 'bold' },
  modalCancelButton: { marginTop: 15, paddingVertical: 12, backgroundColor: '#ccc', borderRadius: 5, alignItems: 'center' },
});
