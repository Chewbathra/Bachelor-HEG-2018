import {Dimensions, StyleSheet} from "react-native";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: '#2B3654',
    backgroundColor: '#2A2E43',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  header: {
    width: WIDTH,
    backgroundColor: '#000000',
    marginBottom: 10
  },
  icon: {
    color: '#FFF'
  },
  buttonText: {
    color: "#FFF",
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  //Segment
  segmentContainer:{
    width: WIDTH / 100 * 80,
    marginLeft: WIDTH / 100 * 10,
    height: 40,
    borderRadius: 10,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#353A50',
  },
  segmentButton:{
    display: 'flex',
    width: WIDTH / 100 * 40,
    height: 40,
    borderRadius: 10,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    backgroundColor: '#F39C1D'
  },
  segmentUnselected: {
    backgroundColor: '#353A50'
  },
  segmentText: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 10
  },
});