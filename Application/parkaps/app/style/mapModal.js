import {Dimensions, StyleSheet} from "react-native";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const mapModalStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2A2E43',
  },
  map: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 50
  }
});