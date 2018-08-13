import {Dimensions, StyleSheet} from "react-native";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const logInUpStyle = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2A2E43',
    // flex: 1,
    // alignItems: 'center'
  },
  segment:{
    marginVertical: 50
  },
  input: {
    width: WIDTH / 100 * 90,
    marginVertical: 10,
    // marginLeft: WIDTH / 100 * 5,
    paddingHorizontal: 20,

    backgroundColor: '#454F63',
    borderBottomWidth : 0,
    borderRadius: 15,
  },
  switch: {
    width: WIDTH / 100 * 90,
    marginVertical: 10,
    // marginLeft: WIDTH / 100 * 5,
    paddingHorizontal: 20,

    backgroundColor: 'transparent',
    borderBottomWidth : 0,
    borderRadius: 15,
  },
  switchText: {
    marginLeft: 15,
    color: 'white',
    fontSize: 15,
    lineHeight: 15
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
  sendButton:{
    width:  WIDTH / 100 * 80,
    marginTop: WIDTH / 100 * 10,
    left: WIDTH / 2 - (WIDTH / 100 * 80) / 2,

    flex: 1,
    justifyContent: 'center',

    borderColor: '#F0CC3D',
    borderWidth: 1,
    borderRadius: 10,

    backgroundColor: '#F39C1D'
  }
})