import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Modal, Alert } from 'react-native';
import Button from './Button';
import axios from 'axios';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  productId: string;
  userId: string;
  userName: string;
}

const ReviewModal = ({ visible, onClose, productId, userId, userName }: ReviewModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  const giveReview = async () => {
    if (productId.length !== 0 && userId.length !== 0) {
      try {
        const res = await axios.post('/giveReview', {
          productId,
          userId,
          firstName: userName,
          rating,
          comment: message,
        });

        if (res?.data) {
          Alert.alert('Success', 'Review submitted successfully.');
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        Alert.alert('Error', 'Something went wrong while submitting the review.');
      }
    } else {
      Alert.alert('Error', 'Please fill all the fields.');
    }
  };

  const handleReviewSubmit = () => {
    giveReview();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.reviewModalContainer}>
        <View style={styles.reviewModalContent}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.reviewModalTitle}>Please add a Review</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.textLabel}>Insert a rating (1 to 5)</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Rating"
              keyboardType="numeric"
              value={rating ? String(rating) : ''}
              onChangeText={(text) => setRating(Number(text))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.textLabel}>Insert a message</Text>
            <TextInput
              style={[styles.reviewInput, { height: 80 }]}
              placeholder="Message"
              multiline
              value={message}
              onChangeText={setMessage}
            />
          </View>

          <View style={styles.submitButton}>
            <Button
              customStyle={styles.submitButton}
              onPress={handleReviewSubmit}
              label="Submit"
              backgroundColor="#284B63"
              width={150}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  reviewModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  reviewModalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  reviewModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  reviewInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  submitButton: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default ReviewModal;
