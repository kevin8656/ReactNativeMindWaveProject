import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  imageView: {
    marginLeft: 10,
    width: width * 0.2,
  },
  icon: {
    fontSize: width * 0.2,
    fontWeight: 'normal',
  },
})