import {
  StyleSheet, Dimensions,
} from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    marginTop: 35,
    marginBottom: 35,
    fontSize: 45
  },
  textInput: {
    width: width * 0.6,
    height: width * 0.1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 5,
    fontFamily: 'Euphemia UCAS',
    marginBottom: 18
  },
  iosHeight: {
    height: 30
  },
  button: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 18,
    paddingRight: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    marginTop: 10,
  },
})