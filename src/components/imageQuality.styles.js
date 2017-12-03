import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  imageView: {
    width: width * 0.15,
  },
  imageQuality: {
    width: width * 0.15,
    height: width * 0.15,
    marginRight: 13
  },
})