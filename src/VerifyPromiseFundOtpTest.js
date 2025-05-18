// VerifyPromiseFundOtpTest.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfirmPaysofterPromiseTest from "./ConfirmPaysofterPromiseTest";
import { generateRandomNum } from "./GenerateRandomNum";
import Loader from "./Loader";
import { Card } from "react-native-paper";
import MessageFixed from "./MessageFixed";
import Message from "./Message";
import { PAYSOFTER_API_URL } from "./config/apiConfig";
import axios from "axios";

const VerifyPromiseFundOtpTest = ({
  email,
  amount,
  promises,
  paysofterPublicKey,
  qty,
  productName,
  referenceId,
  formattedPayerEmail,
  currency,
  duration,
  onSuccess,
}) => {
  const [otp, setOtp] = useState(generateRandomNum(6));
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showConfirmPaysofterPromiseTest, setShowConfirmPaysofterPromiseTest] =
    useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sendOtpData, setSendOtpData] = useState(null);

  const createdAt = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

  const paymentMethod = "Paysofter Promise";

  useEffect(() => {
    const fetchSendOtpData = async () => {
      try {
        const data = await AsyncStorage.getItem("debitAccountData");
        setSendOtpData(data ? JSON.parse(data) : {});
      } catch (e) {
        console.error("Error fetching data from AsyncStorage:", e);
      }
    };
    fetchSendOtpData();
  }, []);

  const paysofterPromiseData = {
    // email: sendOtpData?.email,
    buyer_email: sendOtpData?.email,
    amount: sendOtpData?.amount,
    currency: sendOtpData?.currency,
    account_id: sendOtpData?.account_id,
    promises: promises,
    public_api_key: sendOtpData?.public_api_key,
    // email: email,
    // buyer_email: email,
    // currency: currency,
    // amount: amount,
    // account_id: sendOtpData?.account_id,
    // public_api_key: paysofterPublicKey,
    qty: qty,
    product_name: productName,
    reference_id: referenceId,
    duration: duration,
    created_at: createdAt,
    payment_method: paymentMethod,
  };
  console.log("paysofterPromiseData:", paysofterPromiseData);

  const handleCreatePromise = async (paysofterPromiseData) => {
    try {
      const response = await axios.post(
        `${PAYSOFTER_API_URL}/api/create-promise/`,
        paysofterPromiseData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleVerifyEmailOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await handleCreatePromise(paysofterPromiseData);
      setShowSuccessMessage(true);
      setHasHandledSuccess(true);
      handleOnSuccess();
      AsyncStorage.removeItem("debitAccountData");
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        error.message ||
        "Error creating promise"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmailOtp = () => {
    setResendLoading(true);
    setResendMessage("");
    try {
      setResendMessage(`OTP resent to ${formattedPayerEmail} successfully.`);
      setResendDisabled(true);
    } catch (error) {
      setResendMessage("Error resending OTP. Please try again.");
    }
    setResendLoading(false);
  };

  useEffect(() => {
    let timer;
    if (countdown > 0 && resendDisabled) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    } else if (!resendDisabled) {
      setCountdown(60);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [countdown, resendDisabled]);

  const handleOnSuccess = useCallback(() => {
    onSuccess();
  }, [onSuccess]);

  useEffect(() => {
    if (hasHandledSuccess) {
      setTimeout(() => {
        setShowConfirmPaysofterPromiseTest(true);
        setShowSuccessMessage(false);
      }, 3000);
    }
  }, [hasHandledSuccess]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {showConfirmPaysofterPromiseTest ? (
            <ConfirmPaysofterPromiseTest />
          ) : (
            <View style={styles.content}>
              <Text style={styles.title}>Verify OTP ({currency})</Text>
              {showSuccessMessage && (
                <Message variant="success">
                  A test Promise transaction has been created successfully!
                </Message>
              )}
              {loading && <Loader />}
              {error && <Message variant="danger">{error}</Message>}
              {resendMessage && (
                <Message variant={resendLoading ? "info" : "success"}>
                  {resendMessage}
                </Message>
              )}
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={(text) => setOtp(text)}
                placeholder="Enter OTP"
                editable={false}
              />
              <Button
                title="Verify OTP"
                onPress={handleVerifyEmailOtp}
                disabled={otp === "" || loading}
                color="#28a745"
              />
              <Text style={styles.infoText}>
                OTP has been automatically generated for testing purposes.
              </Text>
              <TouchableOpacity
                onPress={handleResendEmailOtp}
                // disabled={resendDisabled || resendLoading}
                disabled
              >
                <Text style={styles.resendText}>
                  {resendLoading
                    ? "Resending OTP..."
                    : resendDisabled
                      ? `Resend OTP (${countdown}sec)`
                      : "Resend OTP"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.errorContainer}>
            {error && <MessageFixed variant="danger">{error}</MessageFixed>}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  content: {
    marginVertical: 20,
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 20,
  },
  infoText: {
    textAlign: "center",
    marginVertical: 20,
  },
  resendText: {
    color: "blue",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  errorContainer: {
    padding: 10,
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
  roundedDisabledBtn: {
    backgroundColor: "#d3d3d3",
    color: "#fff",
    padding: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default VerifyPromiseFundOtpTest;
