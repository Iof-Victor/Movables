import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface OrderCardProps {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  totalSum: number;
}

const OrderCard = ({ firstName, lastName, address, phoneNumber, totalSum }: OrderCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.detailRow}>
        <Text style={styles.label}>First Name:</Text>
        <Text style={styles.value}>{firstName}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Last Name:</Text>
        <Text style={styles.value}>{lastName}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{address}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{phoneNumber}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Total:</Text>
        <Text style={styles.value}>{totalSum}$</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E7EAEA',
    borderRadius: 10,
    padding: 16,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  value: {
    fontSize: 14,
    flexShrink: 1,
    color: '#555',
  },
});

export default OrderCard;
