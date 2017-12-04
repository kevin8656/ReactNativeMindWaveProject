import { StyleSheet, Dimensions } from 'react-native';
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
    // borderWidth: 1,
    // borderColor: 'gray',
    backgroundColor: '#B3E5FC',
    // borderRadius: 4,
  },
  btnContainer: {
    paddingTop: 20,
    alignSelf: 'center',
  },
  btnText: {
    color: '#424242',
  },
});