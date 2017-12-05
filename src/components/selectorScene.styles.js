import {
  StyleSheet, Platform, Dimensions,
} from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    maxWidth: 300,
    width,
    marginTop: Platform.select({
      ios: 10,
      android: 0,
    }),
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    width: undefined,
  },
  switch: {
    alignSelf: 'center',
  }
});