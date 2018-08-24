import React from "react";
import { View, Text, Alert, ScrollView, Dimensions } from "react-native";
import {inject} from 'mobx-react';
import {API} from "../../config/provider";

import { Button, Icon } from 'native-base';
import {PlaceCard} from "../../components/placeCard";
import {Loader} from "../../components/loader";

import {profileStyles, globalStyles} from "../../style/index";

@inject('userStore')
export class ProfileScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      user: {
        name: '',
        balance: 0,
        email: '',
      },
      carParks: [],
      spotSelected: true,
    };
    this.showInfoCarPark = this.showInfoCarPark.bind(this);
    this.fetchUser();
  }

  async fetchUser(){
    API.getUserInfos(this.props.userStore.token, this.props.userStore.tokenType).then(response => {
      if(response.status === 200){
        this.setState({
          user: response.data.user,
        }, () => {
          this.fetchCarPark();
        })
      } else {
        Alert.alert(
          "Erreur",
          "Votre profil n'a pas pu être récupéré"
        );
        this.setState({
          loading: false
        });
      }
      }).catch(error => {
        this.setState({
          loading: false
        });
        Alert.alert(
          "Erreur",
          "Votre profil n'a pas pu être récupéré"
        );
        console.log(error);
      })
  }

  async fetchCarPark(){
    this.setState({
      loading: true,
      carParks: []
    }, () => {
      API.getUserCarParks(this.props.userStore.token, this.props.userStore.tokenType).then(response => {
        if(response.status === 200){
          this.setState({
            loading: false,
            carParks: response.data.carparks
          })
        } else {
          Alert.alert(
            "Erreur",
            "Vos places de parking n'ont pas pu être récupérées"
          );
          this.setState({
            loading: false
          });
        }
      }).catch(error => {
        console.log(error);
        Alert.alert(
          "Erreur",
          "Vos places de parking n'ont pas pu être récupérées"
        );
        this.setState({
          loading: false
        });
      })
    })
  }

  openParameters(){
    this.props.navigation.navigate("Parameters");
  }

  setActiveList(list){
    this.setState({
      spotSelected: list
    })
  }

  showInfoCarPark(carPark){
    // console.log(carPark);
    this.props.navigation.navigate("AddPlace", {carPark: carPark, update: () => this.fetchCarPark()});
    // this.props.navigation.navigate("AddSchedule", {carPark: carPark, update: () => this.fetchUser()});
  }


  openNewPlace(){
    this.props.navigation.navigate("AddPlace", {update: () => this.fetchCarPark()});
  }

  render() {
    const {user, carParks} = this.state;
    let list = null;
    if(this.state.spotSelected){
      list =
        <View style={profileStyles.listContainer}>
          <ScrollView style={{width: Dimensions.get('window').width}}>
            <Button bordered rounded style={profileStyles.addPlacebutton}
              onPress={() => this.openNewPlace()}>
              <Text style={globalStyles.buttonText}>Ajouter une place</Text>
            </Button>
            {carParks.map((carPark, index) => {
               return <PlaceCard key={index} carPark={carPark} onPress={this.showInfoCarPark} onShowMapPress={this.showMapCarPark}/>
            })}
            {/*{carParks.length === 0 ? <Text>Vous n'avez pas enregistrer de places de parking<Text/> : null}*/}
            <View style={profileStyles.debugView}/>
          </ScrollView>
        </View>;
    }
    return (
      <View style={profileStyles.container}>
        <Loader
          loading={this.state.loading} text={"Chargement"}/>
        <View style={profileStyles.profileContainer}>
          <Text style={profileStyles.name}>{user.name}</Text>
          <Button rounded  style={profileStyles.moreButton}
            onPress={() => this.openParameters()}>
              <Icon name={"settings"} style={globalStyles.icon}/>
          </Button>
        </View>
        <View style={[globalStyles.segmentContainer, profileStyles.segment]}>
          <Button style={[globalStyles.segmentButton, this.state.spotSelected ? globalStyles.segmentSelected : globalStyles.segmentUnselected]}
            onPress={() => this.setActiveList(true)}>
            <Text style={globalStyles.segmentText}>PLACES</Text>
          </Button>
          <Button style={[globalStyles.segmentButton, this.state.spotSelected ? globalStyles.segmentUnselected : globalStyles.segmentSelected]}
            onPress={() => this.setActiveList(false)}>
            <Text style={globalStyles.segmentText}>LOCATIONS</Text>
          </Button>
        </View>
        {list}
      </View>
    );
  }
}
