import {
  StyleSheet, Dimensions,
} from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  qualityTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 35,
    width: width,
    height: width * 0.15,
    justifyContent: 'center',
  },
  connectionTitleView: {
    width: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectionTitle: {
    fontSize: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlImage: {
    width: width * 0.2,
    height: width * 0.2,
  },
  timeCounterText: {
    paddingVertical: 15,
    fontSize: 18,
  },
  timeCounterRecorded: {
    color: 'red',
  },
})