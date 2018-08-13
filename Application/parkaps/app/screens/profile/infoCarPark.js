import React from "react";
import { View, Text } from "react-native";
import {Header, Left, Body, Title, Button, Icon} from 'native-base';
import {globalStyles, infoCarParkStyles} from "../../style";

export class InfoCarParkScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      carPark: this.props.navigation.getParam('carPark')
    }
    console.log(this.state.carPark);
  }

  render() {
    const {carPark} = this.state;
    return (
      <View style={infoCarParkStyles.container}>
        <Header style={globalStyles.header} androidStatusBarColor='#000000'>
          <Left>
            <Button transparent
                    onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
            <Title>Place de parking</Title>
          </Body>
        </Header>
        <Text style={infoCarParkStyles.infoText}>Adresse: {carPark.address}</Text>
        <Text style={infoCarParkStyles.infoText}>Latitude: {carPark.latitude}</Text>
        <Text style={infoCarParkStyles.infoText}>Longitude: {carPark.longitude}</Text>
        <Text style={infoCarParkStyles.infoText}>Prix à l'heure: {carPark.price} CHF</Text>

      </View>
    )
  }
}
