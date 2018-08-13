import React from "react";

import { ImageBackground, Text } from "react-native";
import {Button} from 'native-base'

import {homeStyles, globalStyles} from '../../style';
import backgroundHome from '../../assets/img/background_home.jpg';




export class HomeScreen extends React.Component {

  navigateTo(screen){
    this.props.navigation.navigate(screen);
  }

  render() {

    return (
      <ImageBackground source={backgroundHome} style={homeStyles.backgroundImage}>
        <Text style={homeStyles.title}>Bienvenue sur parkaps</Text>
        <Text style={homeStyles.subTitle}>Le meilleur moyen de stationner</Text>
        <Text style={homeStyles.buttonTitle}>CONTINUER AVEC :</Text>
        <Button
          onPress={() => this.navigateTo('Login')}
          style={homeStyles.emailButton}>
          <Text style={globalStyles.buttonText}>EMAIL</Text>
        </Button>
      </ImageBackground>
    );
  }
}
