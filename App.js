import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import SignUp from './App/Screens/SignUpScreen';
import RootNavigator from './App/Screens/router'
const App = () => {
  return (
    <View style={{flex: 1}}>
    
       <RootNavigator/>
    
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

/*
 "@@": "^1.12.1",
    "@react-native-community/masked-view": "^0.1.11",
    "@react-native-firebase/app": "^14.5.0",
    "@react-native-firebase/firestore": "^14.5.0",
    "@react-native-firebase/storage": "^14.5.0",
    "@types/react-native-webrtc": "^1.75.5",
    "firebase": "^9.6.7",
    "movement": "0.0.13",
    "react": "17.0.2",
    "react-native": "0.67.2",
    "react-native-elements": "^3.4.2",
    "react-native-gesture-handler": "^2.2.0",
    "react-native-image-base64": "^0.1.4",
    "react-native-image-picker": "^4.7.3",
    "react-native-loading-spinner-overlay": "^3.0.0",
    "react-native-progress": "^5.0.0",
    "react-native-reanimated": "^2.4.1",
    "react-native-safe-area-context": "^3.4.1",
    "react-native-screens": "^3.12.0",
    "react-native-svg": "^12.1.1",
    "react-native-vector-icons": "^9.1.0",
    "react-native-webrtc": "^1.94.2",
    "react-navigation": "^3.11.1"
*/
