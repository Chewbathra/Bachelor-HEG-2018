import React from "react";
import { View, Text, Alert, ScrollView, Dimensions } from "react-native";
import {inject} from 'mobx-react';
import {API} from "../../config/provider";

import { Button, Icon } from 'native-base';
import {PlaceCard} from "../../components/placeCard";
import {OccupantCard} from "../../components/occupantCard";
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
      occupants: [],
      spotSelected: true,
    };
    this.showInfoCarPark = this.showInfoCarPark.bind(this);
    this.deleteOccupant = this.deleteOccupant.bind(this);
  }


  componentDidMount(){
    this.fetchUser();
  }

  async fetchUser(){
    this.setState({
      loading: true,
      carParks: []
    }, () => {
    API.getUserInfos(this.props.userStore.token, this.props.userStore.tokenType).then(response => {
      if(response.status === 200){
        this.setState({
          user: response.data.user,
        });
        this.fetchCarPark();
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
    });
  }

  async fetchCarPark(){
    API.getUserCarParks(this.props.userStore.token, this.props.userStore.tokenType).then(response => {
      if(response.status === 200){
        this.setState({
          carParks: response.data.carparks,
          loading: false
        });
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
  }

  fetchUserOccupants(){
    this.setState({
      loading: true,
      occupants: []
    }, () => {
      API.getUserOccupants(this.props.userStore.token, this.props.userStore.tokenType).then(response => {
        if(response.status === 200){
          this.setState({
            loading: false,
            occupants: response.data.occupants
          });
        } else {
          Alert.alert(
            "Erreur",
            "Vos réservations n'ont pas pu être récupérées"
          );
          this.setState({
            loading: false
          });
        }
      }).catch(error => {
        console.log(error);
        Alert.alert(
          "Erreur",
          "Vos réservations n'ont pas pu être récupérées"
        );
        this.setState({
          loading: false
        });
      })
    })
  }


  openParameters(){
    this.props.navigation.navigate("Parameters", {user: this.state.user});
  }

  setActiveList(list){
    if(list == false){
      this.fetchUserOccupants();
    }
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

  deleteOccupant(occupant){
    this.setState({
      loading: true
    }, () => {
      API.deleteOccupant(occupant.id, this.props.userStore.token, this.props.userStore.tokenType)
        .then(response => {
          this.fetchUserOccupants();
        }).catch(error => {
          console.log(error);
          Alert.alert(
            'Erreur',
            "Votre réservation n'a pas pu être supprimée"
          );
          this.setState({
            loading: false
          })
      })
    });
  }
  render() {
    const {user, carParks, occupants} = this.state;
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
               return <PlaceCard key={index} carPark={carPark} onPress={this.showInfoCarPark}/>
            })}
            {carParks.length === 0 ? <Text style={profileStyles.noInfoText}>Vous n'avez pas créer de places de parking</Text> : null}
            <View style={profileStyles.debugView}/>
          </ScrollView>
        </View>;
    } else {
      list =
      <View style={profileStyles.listContainer}>
        <ScrollView style={{width: Dimensions.get('window').width}}>
          {this.state.occupants.map((occupant, index) => {
            return <OccupantCard key={index} occupant={occupant} onDelete={this.deleteOccupant}/>
          })}
          {this.state.occupants.length === 0 ? <Text style={profileStyles.noInfoText}>Vous n'avez pas réservé de places de parking</Text> : null}
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
