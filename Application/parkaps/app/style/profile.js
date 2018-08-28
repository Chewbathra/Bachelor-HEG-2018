import {Dimensions, StyleSheet} from "react-native";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const profileStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // flex: 1,
    // alignItems: 'center',
    backgroundColor: '#2A2E43'
  },
  profileContainer: {
    width: WIDTH,
    height: HEIGHT / 100 * 20,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segment: {
    marginVertical: 15,
  },
  name:{
    width: WIDTH,
    lineHeight: HEIGHT / 100 * 15,
    color: "#FFF",
    fontFamily: 'Roboto',
    fontSize: 30,
    textAlign: 'center'
  },
  moreButton: {
    backgroundColor: 'transparent',
    left: WIDTH / 100 * 42
  },
  addPlacebutton: {
    width: WIDTH / 100 * 50,
    height: 35,
    left: WIDTH / 100 * 25,
    marginBottom: 10,

    justifyContent: 'center',
    borderColor: '#F0CC3D',
  },
  listContainer: {
    width: WIDTH,
    display: 'flex',
    alignItems: 'center'
  },
  actionSheetWrapper:{
    width: WIDTH / 100 * 80
  },
  debugView: {
    // alignSelf: 'stretch'
    height: HEIGHT / 100 * 30
  },
  noInfoText: {
    color: 'white',
    textAlign: 'center'
  }
});