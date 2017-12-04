import {
  StyleSheet, Dimensions,
} from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    alignSelf: 'center',
    marginTop: 35,
    marginBottom: 35,
    fontSize: 45
  },
  btn: {
    backgroundColor: '#B3E5FC',
  },
  btnContainer: {
    paddingTop: 20,
    alignSelf: 'center',
  },
  btnText: {
    color: '#424242',
  },
})