import {Dimensions, StyleSheet} from "react-native";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const homeStyles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 52,
    textAlign: 'center',
    fontFamily: 'Roboto'
  },
  subTitle: {
    position: 'absolute',
    bottom: HEIGHT / 2 -120,
    width: WIDTH,

    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Roboto'
  },
  buttonTitle:{
    position: 'absolute',
    bottom: 120,
    width: WIDTH,

    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Roboto'
  },
  emailButton:{
    position: 'absolute',
    width: WIDTH / 100 * 80,
    bottom: 30,
    left: WIDTH / 2 - (WIDTH / 100 * 80) / 2,

    flex: 1,
    justifyContent: 'center',

    borderColor: '#F0CC3D',
    borderWidth: 1,
    borderRadius: 10,

    backgroundColor: '#F39C1D'
  }
})