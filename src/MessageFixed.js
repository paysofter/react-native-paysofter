// MessageFixed.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const MessageFixed = ({ variant, children, fixed }) => {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 300000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const getIcon = (variant) => {
    switch (variant) {
      case "success":
        return faCheckCircle;
      case "danger":
        return faTimesCircle;
      case "warning":
        return faExclamationTriangle;
      case "info":
        return faInfoCircle;
      default:
        return faInfoCircle;
    }
  };

  const backgroundColor = (variant) => {
    switch (variant) {
      case "success":
        return "#28a745";
      case "danger":
        return "#dc3545";
      case "warning":
        return "#ffc107";
      case "info":
        return "#17a2b8";
      default:
        return "#17a2b8";
    }
  };

  return showMessage ? (
    <View
      style={[
        styles.messageContainer,
        { position: fixed ? "absolute" : "relative", top: fixed ? 80 : null },
      ]}
    >
      <View
        style={[styles.alert, { backgroundColor: backgroundColor(variant) }]}
      >
        <FontAwesomeIcon
          icon={getIcon(variant)}
          size={24}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.messageText}>{children}</Text>
        <TouchableOpacity
          onPress={() => setShowMessage(false)}
          style={styles.closeButton}
        >
          <FontAwesomeIcon icon={faTimesCircle} size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  messageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  alert: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    width: "90%",
  },
  icon: {
    marginRight: 10,
  },
  messageText: {
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    marginLeft: 10,
  },
});

export default MessageFixed;
