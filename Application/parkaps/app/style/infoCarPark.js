import {Dimensions, StyleSheet} from "react-native";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const infoCarParkStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: '#2B3654',
    backgroundColor: '#2A2E43',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  infoText: {
    color: 'white',
    fontSize: 15,
    lineHeight: 25,
    fontFamily: 'Roboto'
  }
});