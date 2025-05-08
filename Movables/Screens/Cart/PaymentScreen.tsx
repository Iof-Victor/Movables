import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

const PaymentScreen = () => {
  const [pressedApple, setPressedApple] = useState(false);
  const [pressedCard, setPressedCard] = useState(false);
  const [pressedDelivery, setPressedDelivery] = useState(false);

  const createOneButtonAlert = () =>
    Alert.alert('THANK YOU!', 'Your Order has been processed', [
      {
        text: 'OK',
        onPress: () => router.replace('/home'), 
      },
    ]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Payment Methods</Text>
      <Text style={styles.methodText}>Select a Payment Method</Text>

      <View style={styles.paymentOptionsContainer}>
        <TouchableOpacity
          style={pressedApple ? styles.paymentOptionDisabled : styles.paymentOption}
          disabled={pressedApple}
          onPress={() => setPressedApple(true)}
        >
          <View style={styles.paymentTextContainer}>
            <Text>Apple Pay</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.paymentOptionsContainer}>
        <TouchableOpacity
          style={pressedCard ? styles.paymentOptionDisabled : styles.paymentOption}
          disabled={pressedCard}
          onPress={() => setPressedCard(true)}
        >
          <View style={styles.paymentTextContainer}>
            <Text>Visa/MasterCard</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.paymentOptionsContainer}>
        <TouchableOpacity
          style={pressedDelivery ? styles.paymentOptionDisabled : styles.paymentOption}
          disabled={pressedDelivery}
          onPress={() => setPressedDelivery(true)}
        >
          <View style={styles.paymentTextContainer}>
            <Text>At Delivery</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.paymentButton}
        onPress={createOneButtonAlert}
      >
        <Text style={styles.paymentText}>Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#808080',
    marginTop: 20,
  },
  methodText: {
    fontSize: 17,
    marginTop: 40,
    marginBottom: 20,
  },
  paymentOptionsContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  paymentOption: {
    backgroundColor: '#dbdbdb',
    height: 50,
    width: 350,
    borderRadius: 20,
    justifyContent: 'center',
  },
  paymentOptionDisabled: {
    backgroundColor: '#636363',
    height: 50,
    width: 350,
    borderRadius: 20,
    justifyContent: 'center',
  },
  paymentTextContainer: {
    marginLeft: 20,
  },
  paymentButton: {
    backgroundColor: '#284B63',
    marginTop: 120,
    width: 250,
    borderRadius: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentText: {
    fontSize: 15,
    color: 'white',
  },
});

export default PaymentScreen;
