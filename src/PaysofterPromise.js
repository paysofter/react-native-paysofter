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
import { Card, Checkbox } from "react-native-paper";
import PaysofterAccountFundPromise from "./PaysofterAccountFundPromise";
import { PAYMENT_DURATION_CHOICES } from "./payment-constants";

const defaultPromises = [
  "Payment will be held in escrow until all terms are met.",
  "Item will be exactly as described in the listing.",
];

const PaysofterPromise = ({
  email,
  currency,
  amount,
  promises,
  paysofterPublicKey,
  referenceId,
  qty,
  productName,
  onSuccess,
  onClose,
}) => {
  const [durationChoices, setDurationChoices] = useState([]);
  const [acceptedPromises, setAcceptedPromises] = useState(false);

  const promisesToShow = promises?.length > 0 ? promises : defaultPromises;

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

  const [showExpectedDurationInfoModal, setShowExpectedDurationInfoModal] = useState(false);
  const handleExpectedDurationInfoModalShow = useCallback(() => {
    setShowExpectedDurationInfoModal(true);
  }, []);
  const handleExpectedDurationInfoModalClose = useCallback(() => {
    setShowExpectedDurationInfoModal(false);
  }, []);

  const [showPromisesInfoModal, setShowPromisesInfoModal] = useState(false);
  const handlePromisesInfoModalShow = () => {
    setShowPromisesInfoModal(true);
  };
  const handlePromisesInfoModalClose = () => {
    setShowPromisesInfoModal(false);
  };

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
                  promises={promisesToShow}
                  paysofterPublicKey={paysofterPublicKey}
                  referenceId={referenceId}
                  qty={qty}
                  productName={productName}
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

                <Modal
                  visible={showExpectedDurationInfoModal}
                  onRequestClose={handleExpectedDurationInfoModalClose}
                  transparent={true}
                  animationType="slide"
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Expected Settlement Duration</Text>

                      <Text style={styles.modalText}>
                        This represents the seller's estimated fulfillment timeframe for the Promise order.
                      </Text>
                      <View style={styles.learnMoreBtn}>
                        <Button title="Learn more" onPress={handleLearnMore} />
                      </View>
                      <Button title="Close" onPress={handleExpectedDurationInfoModalClose} />
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
                  <View style={styles.headerContainer}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Expected Settlement Duration </Text>
                      <TouchableOpacity onPress={handleExpectedDurationInfoModalShow}>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          size={16}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.selectContainer}>
                    <Picker
                      style={styles.picker}
                      selectedValue={duration}
                      onValueChange={(itemValue) =>
                        handleFieldChange("duration", itemValue)
                      }
                      dropdownIconColor={styles.pickerIconColor.color}
                    >
                      {durationChoices.map(([value, label]) => (
                        <Picker.Item key={value} label={label} value={value} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* <View style={styles.formGroup}>
                  <Text style={styles.label}>Promises</Text>

                  <View style={styles.badgeWrapper}>
                    {promisesToShow?.map((item, idx) => (
                      <View key={idx} style={styles.customBadge}>
                        <Text style={styles.customBadgeText}>
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View> */}

                <View style={styles.formGroup}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Promises </Text>
                    <TouchableOpacity onPress={handlePromisesInfoModalShow}>
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        size={16}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.badgeWrapper}>
                    {promisesToShow?.map((item, idx) => (
                      <View key={idx} style={styles.customBadge}>
                        <Text style={styles.customBadgeText}>
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <Modal
                    visible={showPromisesInfoModal}
                    onRequestClose={handlePromisesInfoModalClose}
                    transparent={true}
                    animationType="slide"
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Promises Info</Text>
                        <Text style={styles.modalText}>
                          Promises are agreements between the buyer and seller, and must include these terms:
                        </Text>
                        {defaultPromises?.map((p, i) => (
                          <Text key={i} style={styles.modalBullet}>• {p}</Text>
                        ))}
                        <View style={styles.learnMoreBtn}>
                          <TouchableOpacity
                            onPress={() => { Linking.openURL('https://paysofter.com/about-paysofter-promise/') }}
                            style={styles.modalLearnMore}
                          >
                            <Text style={styles.modalLearnMoreText}>Learn more</Text>
                          </TouchableOpacity>
                        </View>
                        <Button title="Close" onPress={handlePromisesInfoModalClose} />
                      </View>
                    </View>
                  </Modal>
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.formContainer}>
                    <Checkbox.Item
                      label="Accept Promises"
                      status={acceptedPromises ? "checked" : "unchecked"}
                      onPress={() => setAcceptedPromises(!acceptedPromises)}
                      labelStyle={styles.checkboxLabel}
                      color="#28a745"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <TouchableOpacity
                    style={[
                      styles.roundedPrimaryBtn,
                      !acceptedPromises && { opacity: 0.5 }
                    ]}
                    onPress={submitHandler}
                    disabled={!acceptedPromises}
                  >
                    <Text style={styles.btnText}>Submit</Text>
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
  pickerIconColor: {
    color: "#000",
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
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
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
  btnText: {
    color: "#fff",
  },
  learnMoreBtn: {
    padding: 5,
    marginBottom: 10,
  },
  badgeWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  customBadge: {
    backgroundColor: '#28a745',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginVertical: 2,
    alignSelf: 'auto',
    maxWidth: '90%',
  },
  customBadgeText: {
    color: '#fff',
    fontSize: 12,
    textAlign: "center",
  },
  promisesContainer: {
    width: "100%",
    // height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    // alignItems: "center",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    // alignItems: "center",
    textAlign: "center",
  },
  modalLearnMore: { alignSelf: 'center', marginVertical: 8 },
  modalLearnMoreText: { color: '#007bff' },
  modalBullet:{ marginLeft:8, marginVertical:2 },
});

export default PaysofterPromise;
