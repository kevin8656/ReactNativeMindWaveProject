import {
  StyleSheet, Platform,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    maxWidth: 300,
    marginTop: Platform.select({
      ios: 10,
      android: 0,
    }),
  },
  inputContainer: {
    flex: 1,
  },
  switch: {
    alignSelf: 'center',
  }
});