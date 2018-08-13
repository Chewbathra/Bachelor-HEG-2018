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
    // opacity: 0.7,
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
    marginTop: 10,
    marginBottom: 10
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
  }
});