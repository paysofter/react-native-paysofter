// CardPaymentTest.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Picker } from "@react-native-picker/picker";
import { Card } from "react-native-paper";
import { MONTH_CHOICES, YEAR_CHOICES } from "./payment-constants";
import Message from "./Message";
import MessageFixed from "./MessageFixed";
import Loader from "./Loader";
import { formatAmount } from "./FormatAmount";
import { generateRandomNum } from "./GenerateRandomNum";
import { PAYSOFTER_API_URL } from "./config/apiConfig";
import axios from "axios";
import SuccessScreenTest from "./SuccessScreenTest";

const CardPaymentTest = ({
  amount,
  currency,
  email,
  paysofterPublicKey,
  onSuccess,
  onClose,
  payment_id,
}) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

  const [monthChoices, setMonthChoices] = useState([]);
  const [yearChoices, setYearChoices] = useState([]);

  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMonthChoices(MONTH_CHOICES);
    setYearChoices(YEAR_CHOICES);
  }, []);

  const [cardType, setCardType] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: generateRandomNum(16),
    expirationMonth: "11",
    expirationYear: "2026",
    cvv: generateRandomNum(3),
  });

  const [cvvVisible, setCvvVisible] = useState(false);
  const toggleCvvVisibility = () => setCvvVisible(!cvvVisible);

  const formatCard = (value) => {
    return value
      .replace(/\s?/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  const handlePaymentDetailsChange = (name, value) => {
    if (name === "cardNumber") {
      value = formatCard(value);
      let detectedCardType = "";
      if (/^4/.test(value)) {
        detectedCardType = "Visa";
      } else if (/^5[1-5]/.test(value)) {
        detectedCardType = "Mastercard";
      }
      setCardType(detectedCardType);
    }

    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const isFormValid = () => {
    return (
      paymentDetails.cardNumber &&
      paymentDetails.expirationMonth &&
      paymentDetails.expirationYear &&
      paymentDetails.cvv
    );
  };

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
  const paymentMethod = "Debit Card";

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const paysofterPaymentData = {
      payment_id: payment_id,
      buyer_email: email,
      currency: currency,
      amount: amount,
      public_api_key: paysofterPublicKey,
      created_at: createdAt,
      payment_method: paymentMethod,

      card_number: paymentDetails.cardNumber,
      expiration_month: paymentDetails.expirationMonth,
      expiration_year: paymentDetails.expirationYear,
      cvv: paymentDetails.cvv,
    };

    try {
      const { data } = await axios.post(
        `${PAYSOFTER_API_URL}/api/initiate-transaction/`,
        paysofterPaymentData
      );
      console.log(data);
      setPaymentSuccess(true);
      setShowSuccessMessage(true);
      setTimeout(() => {
        // handleOnClose();
        setShowSuccessMessage(false);
      }, 3000);
      handleOnSuccess();
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

  const handleOnSuccess = useCallback(() => {
    onSuccess();
  }, [onSuccess]);

  // const handleOnClose = useCallback(() => {
  //   onClose();
  // }, [onClose]);

  useEffect(() => {
    if (paymentSuccess && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      setShowSuccessMessage(true);
      handleOnSuccess();
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowSuccessScreen(true);
      }, 3000);
    }
  }, [paymentSuccess, handleOnSuccess, hasHandledSuccess]);

  return (
    <View style={styles.container}>
      {showSuccessScreen ? (
        <SuccessScreenTest />
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.header}>Debit Card</Text>
            {showSuccessMessage && (
              <Message variant="success">Payment made successfully.</Message>
            )}
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}

            <View style={styles.form}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChangeText={(value) =>
                  handlePaymentDetailsChange("cardNumber", value)
                }
                keyboardType="numeric"
                maxLength={19}
                editable={false}
              />
              {cardType && (
                <Text style={styles.cardType}>
                  Detected Card Type: {cardType}
                </Text>
              )}

              <View style={styles.spaceBtwGroup}>
                <Text style={styles.label}>Expiration Month</Text>
                <View style={styles.dateContainer}>
                  <Picker
                    selectedValue={paymentDetails.expirationMonth}
                    // style={styles.picker}
                    onValueChange={(value) =>
                      handlePaymentDetailsChange("expirationMonth", value)
                    }
                  >
                    <Picker.Item label="Select Month" value="" />
                    {monthChoices.map(([value, label]) => (
                      <Picker.Item key={value} label={label} value={value} />
                    ))}
                  </Picker>
                </View>

                <Text style={styles.label}>Expiration Year</Text>
                <View style={styles.dateContainer}>
                  <Picker
                    selectedValue={paymentDetails.expirationYear}
                    // style={styles.picker}
                    onValueChange={(value) =>
                      handlePaymentDetailsChange("expirationYear", value)
                    }
                  >
                    <Picker.Item label="Select Year" value="" />
                    {yearChoices.map(([value, label]) => (
                      <Picker.Item key={value} label={label} value={value} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={paymentDetails.cvv}
                  onChangeText={(value) =>
                    handlePaymentDetailsChange("cvv", value)
                  }
                  placeholder="123"
                  maxLength={3}
                  keyboardType="numeric"
                  secureTextEntry={!cvvVisible}
                  editable={false}
                />
                <TouchableOpacity onPress={toggleCvvVisibility}>
                  <Text>
                    {cvvVisible ? (
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

            <View style={styles.submitBtn}>
              <TouchableOpacity
                style={
                  !isFormValid()
                    ? styles.roundedDisabledBtn
                    : styles.roundedPrimaryBtn
                }
                onPress={submitHandler}
                disabled={!isFormValid() || loading}
              >
                <Text style={styles.btnText}>
                  Pay ({formatAmount(amount)} {currency})
                </Text>
              </TouchableOpacity>
            </View>

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
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  cardType: {
    marginBottom: 20,
  },
  datePicker: {
    width: "100%",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  dateContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    justifyContent: "center",
  },
  spaceBtwGroup: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // paddingVertical: 2,
  },
  row: {
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "end",
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
  formGroup: {
    marginBottom: 10,
  },
  submitBtn: {
    padding: 15,
  },
});

export default CardPaymentTest;
