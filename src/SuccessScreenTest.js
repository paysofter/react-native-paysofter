// SuccessScreenTest.js
import React from "react";
import {
  View,
  Text,
  // TouchableOpacity,
  StyleSheet,
  // Linking,
} from "react-native";
import { Card } from "react-native-paper";
import MessageFixed from "./MessageFixed";

const SuccessScreenTest = () => {
  // const handleClose = () => {
  //   Linking.openURL("https://paysofter.com/");
  // };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.innerContainer}>
            <MessageFixed variant="success">
              Transaction successful!
            </MessageFixed>
            <Text style={styles.title}>Successful!</Text>
            <Text style={styles.description}>
              A test transaction payment has been created successfully!
            </Text>

            {/* <View style={styles.formGroup}>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.roundedPrimaryBtn}>
                  Close
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  innerContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  roundedPrimaryBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  formGroup: {
    padding: 5,
    alignItems: "center",
  },
});

export default SuccessScreenTest;
