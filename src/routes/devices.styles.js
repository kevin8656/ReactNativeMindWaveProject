import {
  StyleSheet,
  Dimensions,

} from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  deviceList: {
    marginTop: 10
  },
  deviceItemTouchable: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#d6d6d4',
  },
  deviceItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceItemLeft: {
    // flex: 1
  },
  deviceItemRight: {
    
  },
  imageCheck: {
    width: width * 0.05,
    height: width * 0.05,
  },
})