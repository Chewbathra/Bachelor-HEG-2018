import {Dimensions, StyleSheet} from "react-native";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const addPlaceStyle = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2A2E43',
  },
  input: {
    width: WIDTH / 100 * 90,
    marginVertical: 2,
    marginLeft: WIDTH / 100 * 5,
    paddingLeft: 20,
    // marginRight: 50,

    backgroundColor: '#454F63',
    borderBottomWidth : 0,
    borderRadius: 15,
  },
  inputArea: {
    width: WIDTH / 100 * 70
  },
  errorInput: {
    width: WIDTH / 100 * 90,
    marginVertical: 10,
    marginLeft: WIDTH / 100 * 5,
    paddingHorizontal: 20,

    backgroundColor: '#454F63',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'red',
    borderRadius: 15,
  },
  inputError: {
    color: 'red',
    marginLeft: WIDTH / 100 * 5,

  },
  middleButton: {
    borderColor: '#F0CC3D',
    width: WIDTH / 100 * 60,
    marginLeft: WIDTH / 100 * 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    marginVertical: 8
  },
  middleButtonText: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 12
  },
  sendButton:{
    width:  WIDTH / 100 * 80,
    marginTop: 20,
    left: WIDTH / 2 - (WIDTH / 100 * 80) / 2,

    flex: 1,
    justifyContent: 'center',

    borderColor: '#F0CC3D',
    borderWidth: 1,
    borderRadius: 10,

    backgroundColor: '#F39C1D'
  }
});