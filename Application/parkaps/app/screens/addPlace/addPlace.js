import React from "react";
import {View, PermissionsAndroid, ToastAndroid, Alert} from "react-native";
import {inject} from 'mobx-react';
import {API} from '../../config/provider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import {globalStyles, addPlaceStyle, profileStyles} from "../../style";
import {Header, Icon, Body, Title, Form, Item, Input, Button, Left, Text} from 'native-base';
import {Loader} from "../../components/loader";

@inject('userStore')
export class AddPlaceScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      errors: [],
      latitude: null,
      longitude: null,
      carPark: this.props.navigation.getParam('carPark', {})
    }
  }

  componentDidMount(){
    if(this.state.carPark != null){
      const carPark = this.state.carPark;
      this.setState({
        latitude: carPark.latitude,
        longitude: carPark.longitude
      })
      this.refs['latitude']._root._lastNativeText = carPark.latitude;
      this.refs['longitude']._root._lastNativeText = carPark.longitude;
      this.refs['price']._root._lastNativeText = carPark.price;
      this.refs['address']._root._lastNativeText = carPark.address;
      this.refs['description']._root._lastNativeText = carPark.description;
    }
  }

  goToProfile(){
    if(this.state.carPark.id != null){
      this.props.navigation.pop();
      this.props.navigation.getParam('update')();
    } else {
      this.props.navigation.pop();
    }
  }

  openSchedule(){
    this.props.navigation.navigate('AddSchedule', {
      carPark: this.state.carPark,
      update: this.props.navigation.getParam('update')
    });
  }

  deleteCarPark(){
    this.setState({
      loading: true
    }, () => {
      API.deleteCarPark(this.state.carPark.id, this.props.userStore.token, this.props.userStore.tokenType)
        .then(response => {
          if(response.status === 201){
            ToastAndroid.show("La place de parking a bien été supprimée", ToastAndroid.SHORT);
            this.setState({
              loading: false
            })
            this.goToProfile();
          } else {
            Alert.alert(
              'Erreur',
              "Erreur inconnue | " + JSON.stringify(error)
            );
            this.setState({
              loading: false
            })
          }
        }).catch(error => {
          console.log(error);
          Alert.alert(
            'Erreur',
            "Erreur inconnue | " + JSON.stringify(error)
          )
          this.setState({
            loading: false
          })
       })

    })
  }

  async getCurrentPosition(){
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Cool Photo App Camera Permission',
          'message': 'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.setState({
            latitude: null,
            longitude: null
          }, () => {
            this.refs['latitude']._root._lastNativeText = position.coords.latitude.toString().slice(0,-1);
            this.refs['longitude']._root._lastNativeText = position.coords.longitude.toString().slice(0,-1)
            this.setState({
              latitude: position.coords.latitude.toString().slice(0,-1),
              longitude: position.coords.longitude.toString().slice(0,-1)
            })
          })
        }, (error) => {
          if(error.code == 2){
            Alert.alert(
              'Erreur',
              "Veuillez activer votre géolocalisation"
            )
          } else  if(error.code == 3) {
            Alert.alert(
              'Erreur',
              "La localisation n'a pas pu être récupérée. Veuillez recommencer"
            )
          } else {
            Alert.alert(
              "Erreur",
              "Une erreur inconnue est survenue : " + error.code + " | " + error.message
            )
          }
        })
      } else {
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur inconnue est survenue : " + error.code + " | " + error.message
      )
    }
  }

  validateLatitude(lat) {
    const reg = new RegExp(/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/);
    return reg.test(lat);
  }

  /**
   * Validates a given longitude $long
   *
   * @param float|int|string $long Longitude
   * @return bool `true` if $long is valid, `false` if not
   */
  validateLongitude(long) {
    const reg = new RegExp(/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/);
    return reg.test(long);
  }

  watchPositionOnMap(){
    if(this.validateLatitude(this.state.latitude) && this.validateLongitude(this.state.longitude)){
      this.props.navigation.navigate('MapModal', {latitude: this.state.latitude, longitude: this.state.longitude})
    } else {
     Alert.alert(
       'Erreur',
       "La latitude et/ou la longitude ne sont pas dans un format correct"
     )
    }
  }

  showImagePicker(){
    this.props.navigation.navigate('AddSchedule', {address: '12 chemin des Grives', id: 1});
  }

  async saveCarPark(){
    if(this.state.carPark.id != null){
      const latitude = this.refs['latitude']._root._lastNativeText;
      const longitude = this.refs['longitude']._root._lastNativeText;
      const price = this.refs['price']._root._lastNativeText;
      const address = this.refs['address']._root._lastNativeText;
      const description = this.refs['description']._root._lastNativeText;
      API.modifyCarPark(this.state.carPark.id, latitude, longitude, address, 'picture', price, description, this.props.userStore.token, this.props.userStore.tokenType)
        .then(response => {
          if(response.status === 201){
            ToastAndroid.showWithGravity(
              "Votre place de parking a correctement été modifiée",
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
            this.setState({
              loading: false,
              errors: [],
            });
          } else {
            this.setState({
              loading: false,
              errors: response.data.errors
            })
          }
        }).catch(error => {
          console.log(error);
          this.setState({
            loading: false,
            errors: error.data.errors
          });
        })
    } else {
      this.setState({
        loading: true
      }, () => {
        const latitude = this.refs['latitude']._root._lastNativeText;
        const longitude = this.refs['longitude']._root._lastNativeText;
        const price = this.refs['price']._root._lastNativeText;
        const address = this.refs['address']._root._lastNativeText;
        const description = this.refs['description']._root._lastNativeText;
        API.createCarPark(latitude, longitude, address, 'picture', price, description, this.props.userStore.token, this.props.userStore.tokenType)
          .then(response => {
            if (response.status == 201) {
              ToastAndroid.showWithGravity(
                "Votre place de parking a correctement été créée",
                ToastAndroid.LONG,
                ToastAndroid.CENTER
              );
              this.setState({
                loading: false,
                errors: [],
              });
              this.props.navigation.navigate('AddSchedule', {
                carPark: response.data.created,
                update: this.props.navigation.getParam('update')
              });
            } else {
              this.setState({
                loading: false,
                errors: response.data.errors
              })
            }
          })
          .catch(error => {
            console.log(error);
            this.setState({
              loading: false,
              errors: error.data.errors
            });
          });
      });
    }
  }

  renderModifyButton(){
    return (
      <View>
        <Button
          style={[addPlaceStyle.sendButton, {marginTop: 5}]}
          onPress={() => this.openSchedule()}>
          <Text style={globalStyles.buttonText}>Modifier les horaires</Text>
        </Button>
        <Button
          style={[addPlaceStyle.sendButton, {marginTop: 5}]}
          onPress={() => this.deleteCarPark()}>
          <Text style={globalStyles.buttonText}>Supprimer</Text>
        </Button>
      </View>
    )
  }

  render() {
    return (
      <View style={addPlaceStyle.container}>
        <Header style={globalStyles.header} androidStatusBarColor='#000000'>
          <Left>
            <Button transparent
              onPress={() => this.goToProfile()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
            <Title>
              {this.state.carPark.id != null ? "Modification d'une place" : 'Ajout d\'une place'}
            </Title>
          </Body>
        </Header>
        <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
          <Loader
            text="Enregistrement"
            loading={this.state.loading} />
          <Form >
            <Item style={this.state.errors["latitude"] == null ? addPlaceStyle.input : addPlaceStyle.errorInput}>
              <Icon name='map' style={globalStyles.icon}/>
              <Input placeholder="Latitude" placeholderTextColor="#959DAD" ref="latitude" defaultValue={this.state.latitude} keyboardType={"phone-pad"}/>
            </Item>
            <Text style={addPlaceStyle.inputError}>{this.state.errors["latitude"] == null ? '' : this.state.errors["latitude"]}</Text>
            <Item style={this.state.errors["longitude"] == null ? addPlaceStyle.input : addPlaceStyle.errorInput}>
              <Icon name='map' style={globalStyles.icon}/>
              <Input placeholder="Longitude" placeholderTextColor="#959DAD" ref="longitude" defaultValue={ this.state.longitude} keyboardType={"phone-pad"}/>
            </Item>
            <Text style={addPlaceStyle.inputError}>{this.state.errors["longitude"] == null ? '' : this.state.errors["longitude"]}</Text>
            <Button bordered rounded style={addPlaceStyle.middleButton}
              onPress={() => this.getCurrentPosition()}>
              <Text style={addPlaceStyle.middleButtonText}>Utiliser le GPS</Text>
            </Button>
            <Button bordered rounded style={addPlaceStyle.middleButton}
              onPress={() => this.watchPositionOnMap()}>
              <Text style={addPlaceStyle.middleButtonText}>Voir sur la carte</Text>
            </Button>
            <Item style={this.state.errors["address"] == null ? addPlaceStyle.input : addPlaceStyle.errorInput}>
              <Icon name='key' style={globalStyles.icon}/>
              <Input placeholder="Adresse" placeholderTextColor="#959DAD" ref="address" defaultValue={this.state.carPark.address}/>
            </Item>
            <Text style={addPlaceStyle.inputError}>{this.state.errors["address"] == null ? '' : this.state.errors["address"]}</Text>
            <Item style={this.state.errors["price"] == null ? addPlaceStyle.input : addPlaceStyle.errorInput}>
              <Icon name='cash' style={globalStyles.icon}/>
              <Input placeholder="Prix par heure" placeholderTextColor="#959DAD" ref="price" keyboardType={"phone-pad"} defaultValue={this.state.carPark.price}/>
            </Item>
            <Text style={addPlaceStyle.inputError}>{this.state.errors["price"] == null ? '' : this.state.errors["price"]}</Text>
            {/*<Button bordered rounded style={addPlaceStyle.middleButton}*/}
              {/*onPress={() => this.showImagePicker()}>*/}
              {/*<Text style={addPlaceStyle.middleButtonText}>Sélectionner une image</Text>*/}
            {/*</Button>*/}
            <Item style={this.state.errors["description"] == null ? addPlaceStyle.input : addPlaceStyle.errorInput}>
              <Icon name='book' style={globalStyles.icon}/>
              <Input placeholder="Description" placeholderTextColor="#959DAD" ref="description" multiline={true} numberOfLines={4} defaultValue={this.state.carPark.description} />
            </Item>
            <Text style={addPlaceStyle.inputError}>{this.state.errors["description"] == null ? '' : this.state.errors["description"]}</Text>
          </Form>
          <Button
            onPress={() => this.saveCarPark()}
            style={addPlaceStyle.sendButton}>
            <Text style={globalStyles.buttonText}>{this.state.carPark.id != null ? 'Modifier' : 'Enregistrer'}</Text>
          </Button>
          {this.state.carPark.id != null ? this.renderModifyButton() : null}
        </KeyboardAwareScrollView>
        <Loader
          text="Enregistrement"
          loading={this.state.loading} />
      </View>
    );
  }
}
