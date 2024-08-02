// TransferPayment.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const TransferPayment = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer</Text>
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

export default TransferPayment;
