import React from "react";
import {AsyncStorage, View, ToastAndroid} from "react-native";
import {inject} from 'mobx-react';
import {Header, Left, Button, Icon, Body, Text, Title} from 'native-base';
import {globalStyles, mapModalStyles} from "../../style";
import {API} from "../../config/provider";

@inject('userStore')
export class ParametersScreen extends React.Component {

  logoutUser(){
    API.logoutUser(this.props.userStore.token, this.props.userStore.tokenType)
      .then(res => {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('tokenType');
        ToastAndroid.show("Vous avez correctement été déconnecté", ToastAndroid.SHORT);
        this.props.navigation.navigate("Login");
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <View style={mapModalStyles.container}>
        <Header style={globalStyles.header} androidStatusBarColor='#000000'>
          <Left>
            <Button transparent
                    onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
          <Title>Localisation de votre place</Title>
          </Body>
        </Header>
        <Text>Paramètres</Text>
        <Button
          onPress={() => this.logoutUser()}>
          <Text>Se déconnecter</Text>
        </Button>
      </View>
    )
  }
}
