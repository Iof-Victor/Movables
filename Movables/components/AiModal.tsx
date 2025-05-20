import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import axios from "axios";
import { useRegion } from "@/context/RegionContext";
import { api } from "@/utils/api";

type Product = {
  name: string;
  description: string;
  quantity: number;
};

type ChatbotModalProps = {
  visible: boolean;
  onClose: () => void;
  product: Product;
};

type Message = {
  sender: "user" | "ai";
  text: string;
};

const AiModal: React.FC<ChatbotModalProps> = ({ visible, onClose, product }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "How can I be of service?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { region } = useRegion();

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
  
    try {
      const res: { reply?: string } = await api('/api/ask-ai', region, {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage.text,
          product: {
            name: product.name,
            description: product.description,
            quantity: product.quantity,
          },
        }),
      });
  
      if (res && res.reply) {
        const aiMessage: Message = { sender: "ai", text: res.reply };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        console.log('Unexpected response format for ask-ai:', res);
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Sorry, something went wrong." },
        ]);
      }
    } catch (err: any) {
      console.error('Error sending message to AI:', err.message);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose}>
        <TouchableOpacity style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Welcome to our AI support</Text>
          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type your question..."
              style={styles.input}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
              <Text style={styles.sendText}>{loading ? "..." : "Send"}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default AiModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  userBubble: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#E6E6E6",
  },
  messageText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
