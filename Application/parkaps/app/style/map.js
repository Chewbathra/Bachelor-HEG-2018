import {Dimensions, StyleSheet} from "react-native";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const mapStyles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  controlsContainer: {
    position: 'absolute',
    width: WIDTH,
    height: Dimensions.get('window').height / 100 * 20,
    bottom: 0,
    zIndex: 10,

    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  slider:{
    width: Dimensions.get('window').width - 100,
    opacity: 0.7
  },
  searchButton:{
    width: WIDTH / 100 * 80,
    left: WIDTH / 2 - (WIDTH / 100 * 80) / 2,
    zIndex: 10,

    justifyContent: 'center',

    borderColor: '#F0CC3D',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#F39C1D',
    opacity: 0.7
  },
  infoText: {
    marginTop: 10,
    width: WIDTH / 100 * 90,
    textAlign: 'center',

    fontFamily: 'Roboto',
    color: '#000000',
    fontWeight: '600'
  },
  moreButton: {
    display: 'flex',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    left: WIDTH / 100 * 80,
    transform: [
      {translateY: -25}
    ],
    zIndex: 1050,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: HEIGHT / 100 * 55,
    zIndex: 1000,
    backgroundColor: '#2A2E43',

    display: 'flex',
    flexDirection: 'column',
  },
  bottomSheetText: {
    fontFamily: 'Roboto',
    color: 'white',
    // textAlign: 'center',
    // lineHeight: 30,
  },
  bottomSheetList: {
    width: WIDTH,
  },
  bottomSheetListItem: {
    borderBottomWidth: 0
  },
  bookButton:{
    width: WIDTH / 100 * 80,
    left: WIDTH / 2 - (WIDTH / 100 * 80) / 2,
    marginTop: 15,

    justifyContent: 'center',

    borderColor: '#F0CC3D',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#F39C1D',
  }
});