import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
// import QuantityButton from './QuantityButton';

interface CartProductCardProps {
  productName: string;
  price: number;
  image: string;
  quantity: number;
  cartId?: string;
  productId: string;
  onChangeQuantity: (quantity: number) => void;
}

const CartProductCard = ({
  productName,
  price,
  image,
  quantity,
  cartId,
  productId,
  onChangeQuantity,
}: CartProductCardProps) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <View style={styles.productTitle}>
          <Text style={styles.title} numberOfLines={2}>
            {productName}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{price}$</Text>
        </View>
        {/* <QuantityButton
          quantity={quantity}
          cartId={cartId}
          productId={productId}
          onChangeQuantity={onChangeQuantity}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginLeft: 14,
    borderRadius: 5,
    flexDirection: 'row',
    height: 180,
    width: 360,
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    resizeMode: 'contain',
    height: 135,
    width: 135,
    borderRadius: 10,
    marginLeft: 10,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  productTitle: {
    width: 180,
  },
  priceContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  price: {
    fontSize: 15,
    color: '#333',
  },
});

export default CartProductCard;
