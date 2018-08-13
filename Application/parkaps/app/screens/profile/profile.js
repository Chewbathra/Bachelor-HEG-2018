import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import {inject} from 'mobx-react';
import {API} from "../../config/provider";

import { Button, Icon } from 'native-base';
import {PlaceCard} from "../../components/placeCard";

import {profileStyles, globalStyles} from "../../style/index";

@inject('userStore')
export class ProfileScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
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
    console.log('fetch user');
    API.getUserInfos(this.props.userStore.token, this.props.userStore.tokenType).then(response => {
      console.log(response);
      this.setState({
        user: response.data.user,
        carParks: response.data.carParks
      })
      }).catch(error => {
        console.log(error);
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
    this.props.navigation.navigate("InfoCarPark", {carPark: carPark});
  }

  openNewPlace(){
    this.props.navigation.navigate("AddPlace", {update: () => this.fetchUser()});
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
               return <PlaceCard key={index} carPark={carPark} onPress={this.showInfoCarPark}/>
            })}
            {/*{carParks.length === 0 ? <Text>Vous n'avez pas enregistrer de places de parking<Text/> : null}*/}
            <View style={profileStyles.debugView}/>
          </ScrollView>
        </View>;
    }
    return (
      <View style={profileStyles.container}>
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
