// PaysofterButton.js
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faCreditCard,
  // faList,
  faMoneyBills,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "react-native-paper";
import PaysofterPromise from "./PaysofterPromise";
import CardPayment from "./CardPayment";
import PaysofterAccountFund from "./PaysofterAccountFund";
import UssdPayment from "./UssdPayment";
import BankPayment from "./BankPayment";
import QrPayment from "./QrPayment";
import TransferPayment from "./TransferPayment";
import { formatAmount } from "./FormatAmount";
import logoImage from "./images/logo.png";
// import { styles } from "../PaysofterStyles";

const PaysofterButton = ({
  amount,
  currency,
  email,
  paysofterPublicKey,
  onSuccess,
  onClose,
  showPaymentModal,
  setShowPaymentModal,
  showFundOption,
  showCardOption,
  showPromiseOption,
}) => {
  const getDefaultPaymentOption = () => {
    if (showPromiseOption) return "promise";
    if (showCardOption) return "card";
    if (showFundOption) return "fund";
    return "promise";
  };

  const [selectedPaymentOption, setSelectedPaymentOption] = useState(
    getDefaultPaymentOption()
  );

  const handlePaymentOptionChange = (option) => {
    setSelectedPaymentOption(option);
  };

  const handleOnClosePayment = () => {
    console.log("onClose called!");
    setShowPaymentModal(false);
    onClose();
  };

  return (
    <View>
      <Modal visible={showPaymentModal} onRequestClose={handleOnClosePayment}>
        <View style={styles.modalHeader}>
          <Card style={styles.card}>
            <Card.Content>
              <TouchableOpacity onPress={handleOnClosePayment}>
                <Text style={styles.closeButton}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    size={16}
                    style={styles.icon}
                    color="red"
                  />{" "}
                  Close
                </Text>
              </TouchableOpacity>

              <View style={styles.logoContainer}>
                <Image
                  source={logoImage}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.modalTitle}>
                Paysofter <Text style={styles.liveMode}>Live</Text>
              </Text>
              <Text>{email}</Text>
              <Text>{`${formatAmount(amount)} ${currency}`}</Text>
            </Card.Content>
          </Card>
        </View>

        <ScrollView>
          <View style={styles.options}>
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.title}>Options</Text>

                <View style={styles.optionsList}>
                  {showPromiseOption && (
                    <View style={styles.payOptionBtn}>
                      <TouchableOpacity
                        onPress={() => handlePaymentOptionChange("promise")}
                        style={
                          selectedPaymentOption === "promise"
                            ? styles.roundedPrimaryBtn
                            : styles.roundedDisabledBtn
                        }
                      >
                        <Text style={styles.payBtnText}>
                          <FontAwesomeIcon
                            icon={faMoneyBillWave}
                            size={16}
                            style={styles.icon}
                            color="#fff"
                          />{" "}
                          Paysofter Promise
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {showCardOption && (
                    <View style={styles.payOptionBtn}>
                      <TouchableOpacity
                        onPress={() => handlePaymentOptionChange("card")}
                        style={
                          selectedPaymentOption === "card"
                            ? styles.roundedPrimaryBtn
                            : styles.roundedDisabledBtn
                        }
                      >
                        <Text style={styles.payBtnText}>
                          <FontAwesomeIcon
                            icon={faCreditCard}
                            size={16}
                            style={styles.icon}
                            color="#fff"
                          />{" "}
                          Debit Card
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {showFundOption && (
                    <View style={styles.payOptionBtn}>
                      <TouchableOpacity
                        onPress={() => handlePaymentOptionChange("fund")}
                        style={
                          selectedPaymentOption === "fund"
                            ? styles.roundedPrimaryBtn
                            : styles.roundedDisabledBtn
                        }
                      >
                        <Text style={styles.payBtnText}>
                          <FontAwesomeIcon
                            icon={faMoneyBills}
                            size={16}
                            style={styles.icon}
                            color="#fff"
                          />{" "}
                          Paysofter Account Fund
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.paymentDetails}>
            {selectedPaymentOption === "promise" && (
              <PaysofterPromise
                amount={amount}
                email={email}
                currency={currency}
                paysofterPublicKey={paysofterPublicKey}
                onSuccess={onSuccess}
                onClose={handleOnClosePayment}
              />
            )}

            {selectedPaymentOption === "card" && (
              <CardPayment
                amount={amount}
                email={email}
                currency={currency}
                paysofterPublicKey={paysofterPublicKey}
                onSuccess={onSuccess}
                onClose={handleOnClosePayment}
              />
            )}

            {selectedPaymentOption === "fund" && (
              <PaysofterAccountFund
                amount={amount}
                email={email}
                currency={currency}
                paysofterPublicKey={paysofterPublicKey}
                onSuccess={onSuccess}
                onClose={handleOnClosePayment}
              />
            )}

            {selectedPaymentOption === "bank" && <BankPayment />}
            {selectedPaymentOption === "transfer" && <TransferPayment />}
            {selectedPaymentOption === "ussd" && <UssdPayment />}
            {selectedPaymentOption === "qr" && <QrPayment />}
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  center: {
    alignItems: "center",
  },
  modalHeader: {
    padding: 10,
    textAlign: "center",
    justifyContent: "center",
  },
  closeButton: {
    alignSelf: "center",
    padding: 10,
    fontSize: 18,
    color: "red",
  },
  payOptionBtn: {
    padding: 3,
  },
  payBtnText: {
    alignSelf: "center",
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  options: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
  paymentDetails: {
    padding: 20,
  },
  icon: {
    marginRight: 5,
  },
  roundedPrimaryBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: 7,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  roundedDisabledBtn: {
    backgroundColor: "#d3d3d3",
    color: "#fff",
    padding: 7,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
  },
  logoContainer: {
    alignItems: "center",
    padding: 10,
  },
  logo: {
    width: 80,
    height: 40,
  },
  // liveMode: {
  //   position: "absolute",
  //   top: 8,
  //   right: 8,
  //   backgroundColor: "green",
  //   color: "white",
  //   borderRadius: 50,
  //   paddingVertical: 4,
  //   paddingHorizontal: 8,
  //   fontSize: 12,
  //   fontWeight: "bold",
  // },

  liveMode: {
    backgroundColor: "green",
    color: "white",
    borderRadius: 20, 
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: "flex-start", 
  },
  
});

export default PaysofterButton;
