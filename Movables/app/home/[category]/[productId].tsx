import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/utils/api";
import { useRegion } from "@/context/RegionContext";

import Button from "../../../components/Button";
import ReviewModal from "../../../components/ReviewModal";
import AiModal from "@/components/AiModal";

const ProductDetails = () => {
  const {
    category,
    productId,
    productName,
    image,
    productColor,
    product: rawProduct,
  } = useLocalSearchParams<{
    category: string;
    productId: string;
    productName: string;
    image: string;
    productColor: string;
    product: any;
  }>();
  const [reviews, setReviews] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [AiModalVisible, setAiModalVisible] = useState(false);
  const [userId, setUserId] = useState("");
  const [reviewEligible, setReviewEligible] = useState<any>();
  const [firstName, setFirstName] = useState("");
  const [cartId, setCartId] = useState("");
  const { region } = useRegion();

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      : 0;

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleModalReview = () => setReviewModal(!reviewModal);
  const toggleAiModal = () => setAiModalVisible(!AiModalVisible);

  const product = useMemo(() => {
    try {
      return JSON.parse(rawProduct);
    } catch (e) {
      console.error("Failed to parse product from URL params", e);
      return null;
    }
  }, [rawProduct]);

  const handleGiveReview = () => {
    if (reviewEligible?.code === 3) {
      Alert.alert(reviewEligible.message);
    } else {
      setReviewModal(true);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await SecureStore.getItem("storage_Key");
      const data = JSON.parse(jsonValue || "{}");
      if (data?.id) {
        setUserId(data.id);
        setCartId(data.cartId);
        setFirstName(data.firstName);
        getReviewEligibility(data.id);
      }
    } catch (e) {
      console.log("Error loading user data:", e);
    }
  };

  const addToCart = async () => {
    try {
      const res = await api("/api/addToCart", region, {
        method: "POST",
        body: JSON.stringify({ productId, cartId }),
      });

      if (res) {
        Alert.alert("Added to cart!");
      } else {
        console.log("Unexpected response format for addToCart:", res);
      }
    } catch (err: any) {
      console.log("Error adding to cart:", err.message);
      Alert.alert("Error", "Failed to add product to cart.");
    }
  };
  const getReviews = async () => {
    try {
      const res = await api("/api/getReviews", region, {
        method: "GET",
        params: { productId },
      });

      if (res) {
        if (Array.isArray(res)) {
          setReviews(res);
        } else {
          console.log("Unexpected response format for reviews:", res);
        }
      } else {
        console.log("Unexpected response format for reviews:", res);
      }
    } catch (err: any) {
      console.log("Error fetching reviews:", err.message);
    }
  };

  const getReviewEligibility = async (id: string) => {
    try {
      const res = await api("/api/checkReviewEligibility", region, {
        method: "GET",
        params: { userId: id, productId },
      });

      if (res) {
        setReviewEligible(res);
      } else {
        console.log("Unexpected response format for review eligibility:", res);
      }
    } catch (err: any) {
      console.log("Error checking review eligibility:", err.message);
    }
  };

  useEffect(() => {
    getReviews();
    getData();
  }, []);

  return (
    <ScrollView style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={{ height: 240, width: 240 }} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{productName}</Text>
      </View>

      <TouchableOpacity style={styles.reviewContainer} onPress={toggleModal}>
        <Text>Reviews</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Reviews</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.avgRating}>
              {avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
            </Text>
            <Text style={styles.ratingStars}>★★★★★</Text>
          </View>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <Text style={styles.reviewRating}>{review.firstName}</Text>
                <Text style={styles.reviewRating}>{review.rating} stars</Text>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))
          ) : (
            <Text>No reviews for this product!</Text>
          )}
          <View style={styles.buttonsContainer}>
            <Button label={"Add Review"} onPress={handleGiveReview} />
            <Button
              label={"Close"}
              onPress={toggleModal}
              customStyle={{ marginTop: 10 }}
            />
            <ReviewModal
              visible={reviewModal}
              onClose={toggleModalReview}
              productId={productId}
              userId={userId}
              userName={firstName}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.reviewContainer}>
        <Text>Color: {productColor}</Text>
      </View>

      <View style={styles.reviewContainer}>
        <Text>Description</Text>
      </View>

      <TouchableOpacity style={styles.reviewContainer} onPress={toggleAiModal}>
        <Text>AI</Text>
      </TouchableOpacity>

      <AiModal
        visible={AiModalVisible}
        onClose={() => setAiModalVisible(false)}
        product={product}
      />

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity style={styles.cartButton} onPress={addToCart}>
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    padding: 5,
  },
  titleContainer: {
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  reviewContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cartButton: {
    backgroundColor: "#9EB7B8",
    marginTop: 8,
    marginBottom: 5,
    width: 250,
    borderRadius: 8,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  cartText: {
    fontSize: 14,
    color: "white",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avgRating: {
    fontSize: 32,
    marginRight: 10,
    fontWeight: "bold",
  },
  ratingStars: {
    fontSize: 18,
    color: "grey",
  },
  reviewItem: {
    margin: 4,
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    padding: 10,
    borderColor: "#d9d9d9",
  },
  reviewRating: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewComment: {
    fontSize: 16,
  },
  buttonsContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
});

export default ProductDetails;
