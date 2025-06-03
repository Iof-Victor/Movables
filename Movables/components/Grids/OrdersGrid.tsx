import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import OrderCard from "../Cards/OrderCard";

interface Order {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  totalSum: number;
}

interface OrdersGridProps {
  orders: Order[];
}

const OrdersGrid = ({ orders }: OrdersGridProps) => {
  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.cardShadow}>
      <OrderCard
        firstName={item.firstName}
        lastName={item.lastName}
        address={item.address}
        phoneNumber={item.phoneNumber}
        totalSum={item.totalSum}
      />
    </View>
  );

  return (
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={(_, index) => `order-${index}`}
      keyboardShouldPersistTaps="handled"
      style={styles.containerFlatList}
      contentContainerStyle={
        orders.length === 0 ? styles.emptyContent : styles.listContent
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  containerFlatList: {
    flex: 1,
    backgroundColor: "white",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  cardShadow: {
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
});

export default OrdersGrid;
