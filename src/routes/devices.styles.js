import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  deviceList: {
    // borderTopWidth: 1,
    // borderColor: '#d6d6d4',
    // width: width,
    marginTop: 10
  },
  deviceItemTouchable: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#d6d6d4',
    width: width
  },
  deviceItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceItemLeft: {
    flex: 0.7,
  },
  deviceItemRight: {
    flex: 0.3,
    alignItems: 'flex-end',
  },
  imageCheck: {
    width: width * 0.05,
    height: width * 0.05,
    marginLeft: 13,
  },
})