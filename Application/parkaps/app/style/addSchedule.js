import {Dimensions, StyleSheet} from "react-native";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const addScheduleStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2A2E43',
  },
  addressText:{
    width: WIDTH,
    textAlign: 'center',
    height: HEIGHT / 100 * 5,
    lineHeight: HEIGHT / 100 * 5
  },
  calendar: {
    flex:1,
    // alignItems:'center',
    backgroundColor: '#2A2E43',
    justifyContent:'center',
    alignSelf:'stretch',
    margin:5
  },
  addScheduleButton: {
    position: 'absolute',
    width: WIDTH / 100 * 60,
    height: 35,
    marginLeft: WIDTH / 100 * 20,
    bottom: 20,

    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: '#F0CC3D',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#F39C1D',
    opacity: 0.7,
  },
  addScheduleButtonText: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 12
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',

    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
  },
  itemText: {
    width: WIDTH / 100 * 60,
  },
  itemButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyDate: {
    height: 15,
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30
  },
  emptyDateText: {
    color: 'white'
  },
  emptyData: {
    backgroundColor: '#2A2E43',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0
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

  dailyItem: {
    width: WIDTH,
    height : 80,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center'
  },
  dailyItemText: {
    marginLeft: 20,
    fontSize: 20,
    fontFamily: 'Roboto',
    color: '#FFF'
  },
  dailyButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 50,
    marginTop: 17
  },
  noDailyItems: {
    fontSize: 15,
    fontFamily: 'Roboto',
    color: '#FFF',
    textAlign:'center'
  }
});