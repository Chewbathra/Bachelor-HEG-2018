import {Dimensions, StyleSheet} from "react-native";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const parameterStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2A2E43'
  },
  infoLabel: {
    fontFamily: 'Roboto',
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    marginTop: 30
  },
  infoText: {
    fontFamily: 'Roboto',
    color: '#F39C1D',
    textAlign: 'center',
    fontSize: 20,
  },
  bigButton:{
    width: WIDTH / 100 * 80,
    left: WIDTH / 2 - (WIDTH / 100 * 80) / 2,
    zIndex: 10,
    marginTop: 30,

    justifyContent: 'center',

    borderColor: '#F0CC3D',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#F39C1D',
  },
  modifyButton: {
    width: WIDTH / 100 * 70,
    height: 35,
    marginLeft: WIDTH / 100 * 15,
    marginTop: 5,

    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: '#F0CC3D',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#F39C1D',
  },
  modifyButtonText: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 12
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'transparent'
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    height: HEIGHT / 100 * 60,
    width: WIDTH / 100 * 90,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainerDaily: {
    height: HEIGHT / 100 * 50
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Roboto',
    marginVertical: 10
  },
  input: {
    width: WIDTH / 100 * 80,
    marginVertical: 2,
    // marginLeft: WIDTH / 100 * 5,
    paddingLeft: 20,
    // marginRight: 50,

    backgroundColor: '#454F63',
    borderBottomWidth : 0,
    borderRadius: 15,
  },
});