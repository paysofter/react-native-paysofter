// PaysofterAccountFundTest.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faInfoCircle,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "./Loader";
import Message from "./Message";
import { Card } from "react-native-paper";
import MessageFixed from "./MessageFixed";
import VerifyAccountFundOtpTest from "./VerifyAccountFundOtpTest";
import { formatAmount } from "./FormatAmount";
// import { PAYSOFTER_API_URL } from "./config/apiConfig";
// import axios from "axios";
import { generateRandomNum } from "./GenerateRandomNum";

const PaysofterAccountFundTest = ({
  amount,
  email,
  paysofterPublicKey,
  referenceId,
  qty,
  productName,
  duration,
  currency,
  onSuccess,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [accountId, setAccountId] = useState(generateRandomNum(12));
  const [securityCode, setSecurityCode] = useState(generateRandomNum(4));
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAccountInfoModal, setShowAccountInfoModal] = useState(false);
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(false);
  const [showVerifyAccountFundOtp, setShowVerifyAccountFundOtp] =
    useState(false);
  const [securityCodeVisible, setSecurityCodeVisible] = useState(false);
  const [formattedPayerEmail, setFormattedPayerEmail] = useState("");

  const handleAccountInfoModalShow = () => setShowAccountInfoModal(true);
  const handleAccountInfoModalClose = () => setShowAccountInfoModal(false);
  const handleSecurityCodeModalShow = () => setShowSecurityCodeModal(true);
  const handleSecurityCodeModalClose = () => setShowSecurityCodeModal(false);
  const toggleSecurityCodeVisibility = () =>
    setSecurityCodeVisible(!securityCodeVisible);
  const handleInfoModalShow = () => setShowInfoModal(true);
  const handleInfoModalClose = () => setShowInfoModal(false);

  const submitHandler = async () => {
    setLoading(true);
    setError("");

    const debitAccountData = {
      account_id: accountId,
      security_code: securityCode,
      amount: amount,
      currency: currency,
      public_api_key: paysofterPublicKey,
    };

    try {
      await AsyncStorage.setItem(
        "debitAccountData",
        JSON.stringify(debitAccountData)
      );
      // const { data } = await axios.post(
      //   `${PAYSOFTER_API_URL}/api/send-debit-fund-account-otp/`,
      //   debitAccountData
      // );
      // setFormattedPayerEmail(data.formattedPayerEmail);
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

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setShowVerifyAccountFundOtp(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleLearnMore = () => {
    Linking.openURL("https://paysofter.com/");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {showVerifyAccountFundOtp ? (
            <VerifyAccountFundOtpTest
              amount={amount}
              currency={currency}
              email={email}
              paysofterPublicKey={paysofterPublicKey}
              referenceId={referenceId}
              qty={qty}
              productName={productName}
              securityCode={securityCode}
              accountId={accountId}
              formattedPayerEmail={formattedPayerEmail}
              duration={duration}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          ) : (
            <>
              <View style={styles.header}>
                <View style={styles.labelContainer}>
                  <Text style={styles.title}>Paysofter Account Fund</Text>
                  <TouchableOpacity onPress={handleAccountInfoModalShow}>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      size={16}
                    // style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Modal
                visible={showAccountInfoModal}
                onRequestClose={handleAccountInfoModalClose}
                transparent={true}
                animationType="slide"
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                      Paysofter Account Fund
                    </Text>
                    <Text style={styles.modalText}>
                      Paysofter Account Fund option settles payments using the
                      payer's funded Paysofter Account Fund.
                    </Text>
                    <Button title="Learn more" onPress={handleLearnMore} />
                    <Button
                      title="Close"
                      onPress={handleAccountInfoModalClose}
                    />
                  </View>
                </View>
              </Modal>

              {success && (
                <Message variant="success">
                  OTP sent to your email {formattedPayerEmail} successfully.
                </Message>
              )}
              {error && <Message variant="danger">{error}</Message>}
              {loading && <Loader />}

              <View style={styles.formGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Account ID </Text>
                  <TouchableOpacity onPress={handleInfoModalShow}>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      size={16}
                    // style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.row}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Paysofter Account ID"
                    value={accountId}
                    onChangeText={(text) => setAccountId(text)}
                    maxLength={12}
                    editable={false}
                  />
                </View>
              </View>

              <Modal
                visible={showInfoModal}
                onRequestClose={handleInfoModalClose}
                transparent={true}
                animationType="slide"
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Paysofter Account ID</Text>
                    <Text style={styles.modalText}>
                      A uniquely assigned 12-digit Paysofter Account ID. Don't
                      have a Paysofter account? You're just about 3 minutes
                      away!
                    </Text>
                    <View style={styles.learnMoreBtn}>
                      <Button
                        title="Create A Free Account"
                        onPress={() => {
                          Linking.openURL("https://paysofter.com/register/");
                        }}
                      />
                    </View>
                    <Button title="Close" onPress={handleInfoModalClose} />
                  </View>
                </View>
              </Modal>

              <View style={styles.formGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Security Code </Text>
                  <TouchableOpacity onPress={handleSecurityCodeModalShow}>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      size={16}
                    // style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.row}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Account Security Code"
                    value={securityCode}
                    onChangeText={(text) => setSecurityCode(text)}
                    secureTextEntry={!securityCodeVisible}
                    maxLength={4}
                    editable={false}
                  />
                  <TouchableOpacity onPress={toggleSecurityCodeVisibility}>
                    <Text>
                      {securityCodeVisible ? (
                        <FontAwesomeIcon
                          icon={faEyeSlash}
                          size={16}
                          style={styles.icon}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faEye}
                          size={16}
                          style={styles.icon}
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Modal
                visible={showSecurityCodeModal}
                onRequestClose={handleSecurityCodeModalClose}
                transparent={true}
                animationType="slide"
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                      Paysofter Account Security Code
                    </Text>
                    <Text style={styles.modalText}>
                      A 4-digit randomly generated Paysofter Account Security
                      Code that expires at a given time. Having issue applying
                      the security code? Refresh your Paysofter account page,
                      logout and login, or clear browsing data.
                    </Text>
                    <Button
                      title="Learn More"
                      onPress={() => {
                        Linking.openURL("https://paysofter.com/");
                      }}
                    />
                    <Button
                      title="Close"
                      onPress={handleSecurityCodeModalClose}
                    />
                  </View>
                </View>
              </Modal>

              <View style={styles.submitContainer}>
                <TouchableOpacity
                  onPress={submitHandler}
                  style={
                    loading || success
                      ? styles.roundedDisabledBtn
                      : styles.roundedPrimaryBtn
                  }
                >
                  <Text style={styles.btnText}>{`Pay (${formatAmount(
                    amount
                  )} ${currency})`}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View>
            <Text style={styles.note}>Note: This is a test transaction; dummy payment details were automatically generated.</Text>
          </View>

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
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  learnMoreBtn: {
    padding: 5,
    marginBottom: 10,
  },
  formGroup: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  submitContainer: {
    marginTop: 20,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorContainer: {
    padding: 10,
  },
  note: {
    color: "green",
    fontSize: 12,
    padding: 20,
    textAlign: "center",
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

export default PaysofterAccountFundTest;
