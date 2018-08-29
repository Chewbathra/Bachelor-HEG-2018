import React from "react";
import {AsyncStorage, View, ToastAndroid, Alert, Modal} from "react-native";
import {inject} from 'mobx-react';
import {Header, Left, Button, Icon, Body, Text, Title, Form, Input, Item} from 'native-base';
import { globalStyles, parameterStyles} from "../../style";
import {API} from "../../config/provider";

@inject('userStore')
export class ParametersScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      user: props.navigation.getParam('user', {}),
      visible: false
    }
  }

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

  showDeleteAlert(){
    Alert.alert(
      'Suppression du compte',
      "Êtes-vous sur de vouloir supprimer votre compte ?",
      [
        {text: 'Oui', onPress: () => this.deleteUser()},
        {text: 'Annuler'},
      ],
      { cancelable: false }
    )
  }

  deleteUser(){
    API.deleteUser(this.props.userStore.token, this.props.userStore.tokenType)
      .then((response) => {
        ToastAndroid.show("Votre compte a correctement été supprimé", ToastAndroid.LONG);
        console.log(response);
        this.props.navigation.popToTop();
      }).catch(error => {
        console.log(error);
        Alert.alert(
          'Erreur',
          "Votre compte n'a pas pu être supprimé"
        )
    })
  }

  /**
   * Open a modal to modify user
   * @param email - If true, will display modify for email
   */
  openModifyUser(){
    this.setState({
      visible: true,
    })
  }

  modifyUser(){
    const user = {
      name: this.refs['value']._root._lastNativeText
    };
    API.modifyUser(user, this.props.userStore.token, this.props.userStore.tokenType)
      .then(res => {
        let user = this.state.user;
        user.name = this.refs['value']._root._lastNativeText;
        this.setState({
          visible: false,
          user: user
        })
        ToastAndroid.show("Nom d'utilisateur correctement modifié", ToastAndroid.SHORT);
      }).catch(error => {
        console.log(error);
        Alert.alert(
          'Erreur',
          "Votre nom d'utilisateur n'a pas pu être modifié"
        )
    })
  }

  render() {
    return (
      <View style={parameterStyles.container}>
        <Header style={globalStyles.header} androidStatusBarColor='#000000'>
          <Left>
            <Button transparent
                    onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
          <Title>Paramètres</Title>
          </Body>
        </Header>
        <Text style={parameterStyles.infoLabel}>Nom d'utilisateur</Text>
        <Text style={parameterStyles.infoText}>{this.state.user.name}</Text>
        <Button bordered rounded style={parameterStyles.modifyButton}
            onPress={() => this.openModifyUser()}>
          <Text style={parameterStyles.modifyButtonText}>Modifier le nom d'utilisateur</Text>
        </Button>
        <Text style={parameterStyles.infoLabel}>Adresse email de connexion</Text>
        <Text style={parameterStyles.infoText}>{this.state.user.email}</Text>

        <Text style={parameterStyles.infoLabel}>Balance du compte</Text>
        <Text style={parameterStyles.infoText}>{this.state.user.balance} pièces</Text>

        <Button style={parameterStyles.bigButton}
          onPress={() => this.logoutUser()}>
          <Text style={globalStyles.buttonText}>SE DECONNECTER</Text>
        </Button>
        <Button style={parameterStyles.bigButton}
          onPress={() => this.showDeleteAlert()}>
          <Text style={globalStyles.buttonText}>SUPPRIMER SON COMPTE</Text>
        </Button>
        <Modal
          transparent={true}
          animationType={'fade'}
          onRequestClose={() => {}}
          visible={this.state.visible}>
          <View style={parameterStyles.modalBackground}>
            <View style={parameterStyles.modalContainer}>
              <Text style={parameterStyles.modalTitle}>Modification du nom d'utilisateur</Text>
              <Form >
                <Item style={parameterStyles.input}>
                  <Icon name='person' style={globalStyles.icon}/>
                  <Input placeholder="Nom d'utilisateur" placeholderTextColor="#959DAD" ref="value"/>
                </Item>
              </Form>
              <Button
                onPress={() => this.modifyUser()}
                style={[parameterStyles.modifyButton, {marginTop: 10}]}>
                <Text style={parameterStyles.modifyButtonText}>Enregistrer</Text>
              </Button>
              <Button
                onPress={() => this.setState({visible: false})}
                style={[parameterStyles.modifyButton, {marginTop: 10}]}>
                <Text style={parameterStyles.modifyButtonText}>Annuler</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}
