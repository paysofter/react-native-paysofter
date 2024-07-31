// Loader.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

function Loader() {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', padding: '20' }}>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
}

export default Loader;
