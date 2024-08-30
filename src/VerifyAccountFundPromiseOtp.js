// VerifyAccountFundPromiseOtp.js
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
import ConfirmPaysofterPromise from "./ConfirmPaysofterPromise";
import Message from "./Message";
import { Card } from "react-native-paper";
import MessageFixed from "./MessageFixed";
import Loader from "./Loader";
import { PAYSOFTER_API_URL } from "./config/apiConfig";
import axios from "axios";

const VerifyAccountFundPromiseOtp = ({
  email,
  amount,
  paysofterPublicKey,
  qty,
  productName,
  referenceId,
  currency,
  duration,
  onSuccess,
  formattedPayerEmail,
  securityCode,
  accountId,
}) => {
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [sendOtpData, setSendOtpData] = useState(null);
  const [showConfirmPaysofterPromise, setShowConfirmPaysofterPromise] =
    useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [promiseLoading, setPromiseLoading] = useState(false);
  const [promiseSuccess, setPromiseSuccess] = useState(false);
  const [promiseError, setPromiseError] = useState("");

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

  const otpData = sendOtpData
    ? {
        otp: otp,
        account_id: sendOtpData?.account_id,
        amount: amount,
        currency: currency,
        public_api_key: paysofterPublicKey,
        created_at: createdAt,
      }
    : {};

  const debitAccountData = sendOtpData
    ? {
        account_id: sendOtpData?.account_id,
        security_code: sendOtpData?.security_code,
        amount: amount,
        public_api_key: paysofterPublicKey,
        qty: qty,
        product_name: productName,
        reference_id: referenceId,
        created_at: createdAt,
      }
    : {};

  const handleVerifyEmailOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${PAYSOFTER_API_URL}/api/verify-otp/`,
        otpData
      );
      console.log(data);
      setSuccess(true);
    } catch (error) {
      setError(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    } finally {
      setLoading(false);
    }
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
    } finally {
      setResendLoading(false);
    }
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
    if (success) {
      const createPaysofterPromise = async () => {
        setPromiseLoading(true);
        setPromiseError("");

        try {
          const paysofterPromiseData = {
            email: email,
            amount: amount,
            public_api_key: paysofterPublicKey,
            qty: qty,
            product_name: productName,
            reference_id: referenceId,
            account_id: sendOtpData?.account_id,
            currency: currency,
            duration: duration,
            created_at: createdAt,
            payment_method: paymentMethod,
          };

          const { data } = await axios.post(
            `${PAYSOFTER_API_URL}/api/create-promise/`,
            paysofterPromiseData
          );
          console.log(data);
          setPromiseSuccess(true);
        } catch (error) {
          setPromiseError(
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message
          );
        } finally {
          setPromiseLoading(false);
        }
      };

      createPaysofterPromise();
    }
  }, [
    success,
    email,
    amount,
    paysofterPublicKey,
    qty,
    productName,
    referenceId,
    sendOtpData?.account_id,
    currency,
    duration,
    createdAt,
    paymentMethod,
  ]);

  useEffect(() => {
    if (promiseSuccess && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      setShowSuccessMessage(true);
      handleOnSuccess();
      setTimeout(() => {
        setShowConfirmPaysofterPromise(true);
        setShowSuccessMessage(false);
        AsyncStorage.removeItem("debitAccountData");
      }, 3000);
    }
  }, [promiseSuccess, handleOnSuccess, hasHandledSuccess]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {showConfirmPaysofterPromise ? (
            <ConfirmPaysofterPromise />
          ) : (
            <View style={styles.content}>
              <Text style={styles.title}>Verify OTP ({currency})</Text>
              {showSuccessMessage && (
                <Message variant="success">Promise sent successfully!</Message>
              )}
              {loading && <Loader />}
              {error && <Message variant="danger">{error}</Message>}
              {promiseLoading && <Loader />}
              {promiseError && (
                <Message variant="danger">{promiseError}</Message>
              )}
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
                required
              />
              <Button
                title="Verify OTP"
                onPress={handleVerifyEmailOtp}
                disabled={otp === "" || loading || success}
                color="#28a745"
              />
              <Text style={styles.infoText}>
                OTP has been sent to your email {formattedPayerEmail} for
                Paysofter Account ID: {sendOtpData?.account_id} and expires in
                10 minutes. It might take a few seconds to deliver.
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
    padding: 5,
  },
  content: {
    marginVertical: 20,
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ddd",
    alignItems: "center",
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
    padding: 10,
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

export default VerifyAccountFundPromiseOtp;
