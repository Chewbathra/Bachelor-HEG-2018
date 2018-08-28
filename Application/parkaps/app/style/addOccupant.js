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
  availabilities: {
    display: 'flex',
    alignItems: 'center'
  },
  availabilitiesTitle: {
    marginTop: 10,
    marginBottom: 10,
  },
  availabilitiesItem: {
    marginHorizontal: 10,
    color: '#F39C1D'
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  title: {
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
  },
  dailyAvailabilitiesItem: {
    color: '#F39C1D',
    marginBottom: 10
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
  inputButton: {
    borderRadius: 15,
    marginTop: 2.5
  },
  sendButton:{
    width:  WIDTH / 100 * 40,
    marginTop: 30,
    marginBottom: 15,
    left: WIDTH /100 * 30,

    flex: 1,
    justifyContent: 'center',

    borderColor: '#F0CC3D',
    borderWidth: 1,
    borderRadius: 10,

    backgroundColor: '#F39C1D'
  },
});