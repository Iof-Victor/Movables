import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { api } from "@/utils/api";
import { useRegion } from "@/context/RegionContext";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const { region } = useRegion();

  const checkEqual = (a: string, b: string) => a.trim() === b.trim();

  const handleRegister = async () => {
    if (!email || !confirmEmail || !password || !confirmPassword) {
      return setAlertMessage("Please fill in all the fields!");
    }

    if (!checkEqual(email, confirmEmail)) {
      return setAlertMessage("Email and Confirm Email must match");
    }

    if (!checkEqual(password, confirmPassword)) {
      return setAlertMessage("Password and Confirm Password must match");
    }

    try {
      const res = await api("/api/createUser", region, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res) {
        router.replace("/account/auth");
      }
    } catch (error: any) {
      if (error?.response?.data) {
        const msg = error.response.data.email || error.response.data.username;
        setAlertMessage(
          msg || "Username or Email is already used. Please try again."
        );
      } else {
        setAlertMessage("Registration failed. Please try again.");
        console.log("Registration error:", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* <Image
          source={require('../../assets/imagines/logo.png')}
          style={styles.logo}
        /> */}
      </View>

      {alertMessage.length > 0 && (
        <Text style={styles.errorAlert}>{alertMessage}</Text>
      )}

      <View style={styles.inputView}>
        <TextInput
          value={email}
          placeholder="Email"
          style={styles.textInput}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={confirmEmail}
          placeholder="Confirm Email"
          style={styles.textInput}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setConfirmEmail}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={password}
          placeholder="Password"
          style={styles.textInput}
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={confirmPassword}
          placeholder="Confirm Password"
          style={styles.textInput}
          secureTextEntry
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.logInText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    right: 130,
  },
  logo: {
    resizeMode: "cover",
    height: 160,
    width: 150,
  },
  inputView: {
    marginVertical: 10,
    alignItems: "center",
  },
  textInput: {
    backgroundColor: "#D9D9D9",
    height: 50,
    width: 350,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#9EB7B8",
    marginTop: 30,
    width: 200,
    borderRadius: 15,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  logInText: {
    fontSize: 15,
    color: "white",
  },
  errorAlert: {
    color: "red",
    fontSize: 13,
    marginVertical: 10,
  },
});

export default RegisterScreen;
