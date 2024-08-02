// PaysofterAccountFundPromise.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faInfoCircle,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "react-native-paper";
import VerifyAccountFundPromiseOtp from "./VerifyAccountFundPromiseOtp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Message from "./Message";
import MessageFixed from "./MessageFixed";
import Loader from "./Loader";
import { formatAmount } from "./FormatAmount";
import { PAYSOFTER_API_URL } from "./config/apiConfig";
import axios from "axios";

const PaysofterAccountFundPromise = ({
  email,
  amount,
  paysofterPublicKey,
  duration,
  currency,
  onSuccess,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formattedPayerEmail, setFormattedPayerEmail] = useState("");
  const [error, setError] = useState("");

  const [accountId, setAccountId] = useState("");
  const [accountIdError, setAccountIdError] = useState("");

  const [securityCode, setSecurityCode] = useState("");
  const [securityCodeError, setSecurityCodeError] = useState("");

  // const [formError, setFormError] = useState("");

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAccountInfoModal, setShowAccountInfoModal] = useState(false);
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(false);
  const [showVerifyAccountFundPromiseOtp, setShowVerifyAccountFundPromiseOtp] =
    useState(false);
  const [securityCodeVisible, setSecurityCodeVisible] = useState(false);

  const handleAccountInfoModalShow = () => setShowAccountInfoModal(true);
  const handleAccountInfoModalClose = () => setShowAccountInfoModal(false);
  const handleSecurityCodeModalShow = () => setShowSecurityCodeModal(true);
  const handleSecurityCodeModalClose = () => setShowSecurityCodeModal(false);
  const toggleSecurityCodeVisibility = () =>
    setSecurityCodeVisible(!securityCodeVisible);
  const handleInfoModalShow = () => setShowInfoModal(true);
  const handleInfoModalClose = () => setShowInfoModal(false);

  const handleFieldChange = (fieldName, value) => {
    switch (fieldName) {
      case "accountId":
        setAccountId(value);
        setAccountIdError("");
        break;
      case "securityCode":
        setSecurityCode(value);
        setSecurityCodeError("");
        break;
      default:
        break;
    }
  };

  const submitHandler = async () => {
    if (!accountId) {
      setAccountIdError("Please enter Account ID.");
      return;
    }

    if (!securityCode) {
      setSecurityCodeError("Please enter Security Code.");
      return;
    }

    const debitAccountData = {
      account_id: accountId,
      security_code: securityCode,
      amount: amount,
      currency: currency,
      public_api_key: paysofterPublicKey,
    };

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${PAYSOFTER_API_URL}/api/send-debit-fund-account-otp/`,
        debitAccountData
      );

      setSuccess(true);
      setFormattedPayerEmail(data.formattedPayerEmail);
      await AsyncStorage.setItem(
        "debitAccountData",
        JSON.stringify(debitAccountData)
      );
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
        setShowVerifyAccountFundPromiseOtp(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {showVerifyAccountFundPromiseOtp ? (
            <>
              <VerifyAccountFundPromiseOtp
                amount={amount}
                email={email}
                currency={currency}
                paysofterPublicKey={paysofterPublicKey}
                duration={duration}
                onSuccess={onSuccess}
                onClose={onClose}
                securityCode={securityCode}
                accountId={accountId}
                formattedPayerEmail={formattedPayerEmail}
              />
            </>
          ) : (
            <>
              <View style={styles.header}>
                <View style={styles.labelContainer}>
                  <Text style={styles.title}>
                    Promise Account Fund ({currency}){" "}
                  </Text>
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
                    <Text style={styles.modalTitle}>Promise Account Fund</Text>
                    <Text style={styles.modalText}>
                      Promise Account Fund option settles payments using the
                      payer's funded Paysofter Account Fund.
                    </Text>
                    <View style={styles.learnMoreBtn}>
                      <Button
                        title="Learn More"
                        onPress={() => {
                          Linking.openURL("https://paysofter.com/");
                        }}
                      />
                    </View>
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

              {/* {formError && <Message variant="danger">{formError}</Message>} */}

              <View style={styles.form}>
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

                  <TextInput
                    style={styles.input}
                    placeholder="Enter Paysofter Account ID"
                    value={accountId}
                    onChangeText={(value) =>
                      handleFieldChange("accountId", value)
                    }
                    maxLength={12}
                  />

                  <Text style={styles.errorText}>{accountIdError}</Text>
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Security Code</Text>
                    <TouchableOpacity onPress={handleSecurityCodeModalShow}>
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        size={16}
                        // style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter Account Security Code"
                    value={securityCode}
                    onChangeText={(value) =>
                      handleFieldChange("securityCode", value)
                    }
                    secureTextEntry={!securityCodeVisible}
                    maxLength={4}
                  />

                  <TouchableOpacity onPress={toggleSecurityCodeVisibility}>
                    <Text style={styles.infoIcon}>
                      {securityCodeVisible ? (
                        <>
                          <FontAwesomeIcon
                            icon={faEyeSlash}
                            size={16}
                            style={styles.icon}
                          />
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faEye}
                            size={16}
                            style={styles.icon}
                          />
                        </>
                      )}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.errorText}>{securityCodeError}</Text>
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
                        Promise Account Fund
                      </Text>
                      <Text style={styles.modalText}>
                        Paysofter Promise Account Fund option settles payments
                        using the payer's funded Paysofter Account Fund.{" "}
                      </Text>
                      <View style={styles.learnMoreBtn}>
                        <Button
                          title="Create A Free Account"
                          onPress={() => {
                            Linking.openURL("https://paysofter.com/register/");
                          }}
                        />
                      </View>

                      <Button
                        title="Close"
                        onPress={handleAccountInfoModalClose}
                      />
                    </View>
                  </View>
                </Modal>

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
                        Code that expires at a given time (e.g. every hour).{" "}
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL("https://paysofter.com/")
                          }
                        >
                          <Text style={styles.modalLink}>Learn More</Text>
                        </TouchableOpacity>
                      </Text>
                      <Button
                        title="Close"
                        onPress={handleSecurityCodeModalClose}
                      />
                    </View>
                  </View>
                </Modal>

                <Modal
                  visible={showInfoModal}
                  onRequestClose={handleInfoModalClose}
                  transparent={true}
                  animationType="slide"
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>
                        Paysofter Account ID Info
                      </Text>
                      <Text style={styles.modalText}>
                        A uniquely assigned 12-digit Paysofter Account ID. Don't
                        have a Paysofter account?{" "}
                        <View style={styles.learnMoreBtn}>
                          <Button
                            title="Create A Free Account"
                            onPress={() => {
                              Linking.openURL(
                                "https://paysofter.com/register/"
                              );
                            }}
                          />
                        </View>
                      </Text>
                      <Button title="Close" onPress={handleInfoModalClose} />
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

                <View style={styles.errorContainer}>
                  {error && (
                    <MessageFixed variant="danger">{error}</MessageFixed>
                  )}
                </View>
              </View>
            </>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    marginVertical: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  infoIcon: {
    fontSize: 20,
    color: "#007bff",
    marginTop: 5,
  },
  learnMoreBtn: {
    padding: 5,
    marginBottom: 10,
  },
  submitContainer: {
    marginTop: 20,
  },
  errorContainer: {
    padding: 10,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    marginBottom: 8,
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

export default PaysofterAccountFundPromise;
