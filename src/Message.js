// Message.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

function Message({ variant, children, fixed }) {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return showMessage ? (
    <View
      style={{
        position: fixed ? "absolute" : "relative",
        top: fixed ? 80 : "auto",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => setShowMessage(false)}
        style={{
          backgroundColor: variant === "danger" ? "#dc3545" : "#28a745",
          padding: 20,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white" }}>{children}</Text>
      </TouchableOpacity>
    </View>
  ) : null;
}

export default Message;
