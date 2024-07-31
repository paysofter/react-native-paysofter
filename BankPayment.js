// BankPayment.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BankPayment = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bank</Text>
      <Text>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default BankPayment;
