import {
  StyleSheet, Platform,
} from 'react-native';

export default StyleSheet.create({
  container: {
    maxWidth: 320,
  },
  inputContainer: {
    marginTop: Platform.select({
      ios: 10,
      android: 0,
    }),
  }
})