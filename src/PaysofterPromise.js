// PaysofterPromise.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Picker } from "@react-native-picker/picker";
import { Card } from "react-native-paper";
import PaysofterAccountFundPromise from "./PaysofterAccountFundPromise";
import { PAYMENT_DURATION_CHOICES } from "./payment-constants";

const PaysofterPromise = ({
  email,
  currency,
  amount,
  paysofterPublicKey,
  onSuccess,
  onClose,
}) => {
  const [durationChoices, setDurationChoices] = useState([]);

  useEffect(() => {
    setDurationChoices(PAYMENT_DURATION_CHOICES);
  }, []);

  const [duration, setDuration] = useState("Within 1 day");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPaysofterAccountFundPromise, setShowPaysofterAccountFundPromise] =
    useState(false);

  const handleShowPaysofterAccountFundPromise = useCallback(() => {
    setShowPaysofterAccountFundPromise(true);
  }, []);

  const handleInfoModalShow = useCallback(() => {
    setShowInfoModal(true);
  }, []);

  const handleInfoModalClose = useCallback(() => {
    setShowInfoModal(false);
  }, []);

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();
      handleShowPaysofterAccountFundPromise();
    },
    [handleShowPaysofterAccountFundPromise]
  );

  const handleFieldChange = (field, value) => {
    if (field === "duration") {
      setDuration(value);
    }
  };
  const handleLearnMore = () => {
    Linking.openURL("https://paysofter.com/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Card style={styles.card}>
          <Card.Content>
            {showPaysofterAccountFundPromise ? (
              <>
                <PaysofterAccountFundPromise
                  amount={amount}
                  email={email}
                  currency={currency}
                  paysofterPublicKey={paysofterPublicKey}
                  duration={duration}
                  onSuccess={onSuccess}
                  onClose={onClose}
                />
              </>
            ) : (
              <View style={styles.container}>
                <View style={styles.headerContainer}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.headerText}>Paysofter Promise </Text>
                    <TouchableOpacity onPress={handleInfoModalShow}>
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        size={16}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
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
                      <Text style={styles.modalTitle}>Paysofter Promise</Text>
                      <Text style={styles.modalText}>
                        Paysofter Promise option escrows or places in custody
                        the payment made to a seller (using the payer's funded
                        Paysofter Account Fund) until a specified condition has
                        been fulfilled.
                      </Text>
                      <View style={styles.learnMoreBtn}>
                        <Button title="Learn more" onPress={handleLearnMore} />
                      </View>
                      <Button title="Close" onPress={handleInfoModalClose} />
                    </View>
                  </View>
                </Modal>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Currency</Text>
                  <TextInput
                    style={styles.input}
                    value={currency}
                    editable={false}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Expected Settlement Duration</Text>
                  <View style={styles.selectContainer}>
                    <Picker
                      style={styles.picker}
                      selectedValue={duration}
                      onValueChange={(itemValue) =>
                        handleFieldChange("duration", itemValue)
                      }
                    >
                      {durationChoices.map(([value, label]) => (
                        <Picker.Item key={value} label={label} value={value} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <TouchableOpacity onPress={submitHandler}>
                    <Text style={styles.roundedPrimaryBtn}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollViewContainer: {
    padding: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: 16,
  },
  selectContainer: {
    // width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    // alignItems: "center",
    textAlign: "center",
    padding: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#e9ecef",
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
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
  learnMoreBtn: {
    padding: 5,
    marginBottom: 10,
  },
});

export default PaysofterPromise;
