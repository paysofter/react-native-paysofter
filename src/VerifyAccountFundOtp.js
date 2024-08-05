// VerifyAccountFundOtp.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Message from "./Message";
import MessageFixed from "./MessageFixed";
import Loader from "./Loader";
import { PAYSOFTER_API_URL } from "./config/apiConfig";
import axios from "axios";
import SuccessScreen from "./SuccessScreen";

const VerifyAccountFundOtp = ({
  amount,
  email,
  currency,
  paysofterPublicKey,
  formattedPayerEmail,
  onSuccess,
  onClose,
}) => {
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
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
  const paymentMethod = "Paysofter Account Fund";

  useEffect(() => {
    const fetchSendOtpData = async () => {
      const data = await AsyncStorage.getItem("debitAccountData");
      setSendOtpData(JSON.parse(data));
    };
    fetchSendOtpData();
  }, []);

  const otpData = {
    otp: otp,
    account_id: sendOtpData?.account_id,
    amount: amount,
    currency: currency,
    public_api_key: paysofterPublicKey,
  };

  const paysofterPaymentData = {
    buyer_email: email,
    amount: amount,
    currency: currency,
    public_api_key: paysofterPublicKey,
    created_at: createdAt,
    payment_method: paymentMethod,
    account_id: sendOtpData?.account_id,
  };

  const debitAccountData = {
    account_id: sendOtpData?.account_id,
    security_code: sendOtpData?.security_code,
    amount: amount,
    currency: currency,
    public_api_key: paysofterPublicKey,
  };

  const handleVerifyEmailOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${PAYSOFTER_API_URL}/api/verify-otp/`, otpData);
      handleCreatePaysofterPayment();
    } catch (error) {
      setError(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    }
    setLoading(false);
  };

  const handleCreatePaysofterPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${PAYSOFTER_API_URL}/api/initiate-transaction/`,
        paysofterPaymentData
      );
      setPaymentSuccess(true);
      setShowSuccessMessage(true);
      setHasHandledSuccess(true);
      handleOnSuccess();
      setTimeout(() => {
        handleOnClose();
        setShowSuccessMessage(false);
        setShowSuccessScreen(true);
      }, 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    }
    setLoading(false);
  };

  const handleResendEmailOtp = async () => {
    setResendLoading(true);
    setResendMessage("");
    try {
      await axios.post(
        `${PAYSOFTER_API_URL}/api/send-debit-fund-account-otp/`,
        debitAccountData
      );
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

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (paymentSuccess && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      setShowSuccessMessage(true);
      handleOnSuccess();
      setTimeout(() => {
        setShowSuccessMessage(false);
        AsyncStorage.removeItem("debitAccountData");
        setShowSuccessScreen(true);
      }, 3000);
    }
  }, [paymentSuccess, handleOnSuccess, hasHandledSuccess]);

  return (
    <View style={styles.container}>
      {showSuccessScreen ? (
        <SuccessScreen />
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.header}>Verify OTP</Text>
            {showSuccessMessage && (
              <Message variant="success">Payment made successfully!</Message>
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
              keyboardType="numeric"
            />
            <Button
              onPress={handleVerifyEmailOtp}
              title="Verify OTP"
              disabled={otp === "" || loading || showSuccessMessage}
              color="#28a745"
            />
            <Text style={styles.otpInfo}>
              OTP has been sent to email: {formattedPayerEmail} for Paysofter
              Account ID: {sendOtpData?.account_id} and expires in 10 minutes.
              It might take a few seconds to deliver.
            </Text>
            <TouchableOpacity
              onPress={handleResendEmailOtp}
              disabled={resendDisabled || resendLoading}
            >
              <Text style={styles.resendText}>
                {resendLoading
                  ? "Resending OTP..."
                  : resendDisabled
                  ? `Resend OTP (${countdown}sec)`
                  : "Resend OTP"}
              </Text>
            </TouchableOpacity>

            <View style={styles.errorContainer}>
              {error && <MessageFixed variant="danger">{error}</MessageFixed>}
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  otpInfo: {
    textAlign: "center",
    marginVertical: 20,
  },
  resendText: {
    color: "#007bff",
    textAlign: "center",
    marginTop: 20,
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

export default VerifyAccountFundOtp;
