// ConfirmPaysofterPromiseTest.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Card } from "react-native-paper";

const ConfirmPaysofterPromiseTest = () => {
  const handleConfirmPromise = () => {
    Linking.openURL("https://paysofter.com/promise/buyer");
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>
              A test promise successfully created!
            </Text>
            <Text style={styles.description}>
              A test promoise transaction email has been sent to you.
            </Text>

            <View style={styles.formGroup}>
              <TouchableOpacity disabled onPress={handleConfirmPromise}>
                <Text style={styles.roundedPrimaryBtn}>
                  Confirm Promise (at Paysofter)
                </Text>
              </TouchableOpacity>
            </View>
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

export default ConfirmPaysofterPromiseTest;
