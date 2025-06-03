import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { useRouter, usePathname } from "expo-router";

const Header = ({ title }: { title?: string }) => {
  const navigation = useNavigation();
  const [goBackTrigger, setGoBackTrigger] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const noBackTitles = ["Home", "Cart", "Account", "Edit Details"];
    setGoBackTrigger(!noBackTitles.includes(title ?? ""));
  }, [title]);

  useEffect(() => {
    const noBackPaths = ["/home", "/cart", "/account/auth", "/account"];
    const isNoBackPath = noBackPaths.includes(pathname);
    const isCheckoutPage = pathname === "/cart/checkout";

    setGoBackTrigger(!isNoBackPath || isCheckoutPage);
  }, [pathname]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      navigation.goBack();
    }
  };

  console.log(router, "title in header");

  return (
    <SafeAreaView style={styles.backgroundColor}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {goBackTrigger && (
            <TouchableOpacity
              onPress={handleGoBack}
              testID="headerBackButton"
              style={styles.icon}
            >
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          )}
          <View style={styles.iconDisplay}>
            <Image
              source={require("../assets/images/mobile.png")}
              style={styles.mobileIcon}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 2,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  icon: {
    marginHorizontal: 3,
    position: "absolute",
    left: 2,
  },
  iconDisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 35,
  },
  mobileIcon: {
    width: 40,
    height: 40,
  },
  titleScreen: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
  },
  titleDisplay: {
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundColor: {
    backgroundColor: "#ffffff",
  },
});

export default Header;
