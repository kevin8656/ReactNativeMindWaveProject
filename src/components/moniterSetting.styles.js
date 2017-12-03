import {
  StyleSheet,
  Dimensions,
} from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: width * 0.05
  },
  textInput: {
    width: width * 0.7,
    height: width * 0.1,
    borderColor: 'gray',
    borderWidth: 1,
    fontFamily: 'Euphemia UCAS',
    color: 'gray'
  },
  iosHeight: {
    height: 30
  },
  switch: {
    marginLeft: 10,
  }
});