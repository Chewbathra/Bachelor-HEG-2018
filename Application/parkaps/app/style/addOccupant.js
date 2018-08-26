import {Dimensions, StyleSheet} from "react-native";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const addOccupantStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2A2E43',
  },
  list: {
    width: WIDTH,
  },
  listItem: {
    borderBottomWidth: 0
  },
  listText: {
    fontFamily: 'Roboto',
    color: 'white',
    // textAlign: 'center',
    // lineHeight: 30,
  },
  calendar:{
    width: WIDTH,
    height: 310
  },
  addOccupantButton:{
    width: WIDTH / 100 * 80,
    left: WIDTH / 2 - (WIDTH / 100 * 80) / 2,
    zIndex: 10,

    marginBottom: 10,
    marginTop: 20,

    justifyContent: 'center',

    borderColor: '#F0CC3D',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#F39C1D',
  },
});