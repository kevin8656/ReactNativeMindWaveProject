import {
  StyleSheet, Platform, Dimensions,
} from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    maxWidth: 320,
    width,
  },
  inputContainer: {
    marginTop: Platform.select({
      ios: 10,
      android: 0,
    }),
  },
  input: {
    width: undefined
  },
})