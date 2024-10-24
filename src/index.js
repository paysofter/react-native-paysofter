// index.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"; 
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PaysofterButton from "./PaysofterButton";
import PaysofterButtonTest from "./PaysofterButtonTest";   
import Loader from "./Loader";
import MessageFixed from "./MessageFixed";
import { PAYSOFTER_API_URL } from "./config/apiConfig"; 

export const Paysofter = ({
  amount,
  currency,
  email,
  paysofterPublicKey,
  onSuccess,
  onClose,
  referenceId,
  qty,
  productName,
  buyerName,
  buyerPhoneNumber,
  showFundOption,
  showCardOption,
  showPromiseOption,
}) => {
  const [apiKeyStatus, setApiKeyStatus] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  console.log('apiKeyStatus:', apiKeyStatus)
  console.log('amount:', amount)
  console.log('currency:', currency)
  console.log('paysofterPublicKey:', paysofterPublicKey)
  console.log('PAYSOFTER_API_URL:', PAYSOFTER_API_URL)
  console.log('email:', email)

  useEffect(() => {
    const fetchApiKeyStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${PAYSOFTER_API_URL}/api/get-api-key-status/`,
          {
            public_api_key: paysofterPublicKey,
          }
        );

        const data = response.data;
        console.log("data:", data);
        console.log("response.data:", response.data);

        if (response.status === 200) {
          setApiKeyStatus(data.api_key_status);
          setShowPaymentModal(true);

          console.log("api_key_status:", data.api_key_status);
          setSuccess(true);
        } else {
          setError(data.detail || "Unexpected response from server.");
        }
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Error fetching API key status. Check your network connectivity and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApiKeyStatus();
  }, [paysofterPublicKey]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setLoading(false);
        setError(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleClose = () => {
    setError(null);
    setApiKeyStatus(null);
    setShowPaymentModal(false);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {(loading || error) && (
        <Modal
          visible={loading || !!error}
          transparent={true}
          animationType="slide"
          onRequestClose={handleClose}  
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size={24}
                  style={styles.icon}
                  // color="red"
                />
                {/* <Text style={styles.closeButtonTex}> Close</Text> */}
              </TouchableOpacity>

              <Text style={styles.modalTitle}>
                {loading ? "Loading..." : "Error!"}
              </Text>
              {loading && <Loader />}
              {error && <MessageFixed variant="danger">{error}</MessageFixed>}
            </View>
          </View>
        </Modal>
      )}
      <Text style={styles.header}>Paysofter Promise Option</Text>
      <View style={styles.buttonContainer}>
        {apiKeyStatus === "live" && (
          <PaysofterButton
            amount={amount}
            email={email}
            currency={currency}
            paysofterPublicKey={paysofterPublicKey}
            onSuccess={onSuccess}
            onClose={onClose}
            referenceId={referenceId}
            qty={qty}
            productName={productName}
            buyerName={buyerName}
            buyerPhoneNumber={buyerPhoneNumber}
            showPaymentModal={showPaymentModal}
            setShowPaymentModal={setShowPaymentModal}
            showPromiseOption={showPromiseOption}
            showFundOption={showFundOption}
            showCardOption={showCardOption}
          />
        )}
        {apiKeyStatus === "test" && (
          <PaysofterButtonTest
            amount={amount}
            email={email}
            currency={currency}
            paysofterPublicKey={paysofterPublicKey}
            onSuccess={onSuccess}
            onClose={onClose}
            referenceId={referenceId}
            qty={qty}
            productName={productName}
            buyerName={buyerName}
            buyerPhoneNumber={buyerPhoneNumber}
            showPaymentModal={showPaymentModal}
            setShowPaymentModal={setShowPaymentModal}
            showPromiseOption={showPromiseOption}
            showFundOption={showFundOption}
            showCardOption={showCardOption}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 5,
  },
  // closeButton: {
  //   marginTop: 20,
  //   padding: 10,
  //   // backgroundColor: "#dc3545",
  //   borderRadius: 5,
  // },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Paysofter;
