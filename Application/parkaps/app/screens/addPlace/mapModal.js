import React from 'react';
import {
  Dimensions,
  View,
} from 'react-native';

import {Header, Button, Icon, Left, Title, Body} from 'native-base';
import MapView, { Marker } from 'react-native-maps'

import {globalStyles, mapModalStyles} from "../../style";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export class MapModalScreen extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      visible: true,
      latitude: parseFloat(props.navigation.getParam('latitude', null)),
      longitude: parseFloat(props.navigation.getParam('longitude', null))
    }
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
        <MapView
          ref={(ref) => {this.mapRef = ref}}
          style={mapModalStyles.map}
          initialRegion={{
            latitude:      this.state.latitude,
            longitude:     this.state.longitude,
            latitudeDelta:  0.002*5,
            longitudeDelta: 0.002*5
          }}
          loadingEnabled={true}>
          <Marker
            coordinate={{latitude: this.state.latitude, longitude: this.state.longitude}}
            pinColor={"#F39C1D"}
            title={"Votre Place"}/>
        </MapView>
      </View>
    )
  }
};
