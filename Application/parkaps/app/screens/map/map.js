import React from "react";
import {View, Slider, Text, BackHandler, ToastAndroid, PermissionsAndroid } from 'react-native'
import MapView, { Circle, Marker } from 'react-native-maps'
import {inject} from 'mobx-react';
import {API} from "../../config/provider";

//Style
import {mapStyles, globalStyles} from "../../style/index";
import { Button, Icon, List, ListItem, Body, Left } from 'native-base';

//Components
import {Loader} from "../../components/loader";

@inject('userStore')
export class MapScreen extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.mapRef = null;
    this.state = {
      markers: [],
      loading: false,
      bottomSheetVisible: false,
      marker: null,
      showUserLocation: false,
      circle: {
        center: {latitude: 46.20417949927879, longitude: 6.147610321640968},
        radius: 1000
      },
      initalRegion: {
        latitude:       46.20417949927879,
        longitude:      6.147610321640968,
        latitudeDelta:  0.00922*5,
        longitudeDelta: 0.00421*5
      },
      currentRegion: null
    }
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
    this.openBottomSheet = this.openBottomSheet.bind(this);
  }

  /**
   * Create an event listener for the back button and ask for permission
   */
  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
    this.askForPermissions();
  }

  /**
   * Destroy event listeners
   */
  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  /**
   * Watch if we need to go back or stay on this page
   * @author Loïc Schupbach
   * @method onBackButtonPressAndroid
   * @return {boolean} True if we dont go back
   */
  onBackButtonPressAndroid = () => {
    this.closeBottomSheet();
    return true;
  };

  /**
   * Ask For permission (geolocalisation)
   * @return {Promise<void>}
   */
  async askForPermissions(){
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Parkaps location permission',
          'message': 'Parkaps need to access to your location'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({
          showUserLocation: true
        });
      }
    }
     catch (err) {
      console.warn(err)
    }
  }

  /**
   * Set a new region in the state
   * @author Loïc Schupbach
   * @method onRegionChange
   * @param region The new region to set in state
   * @return none
   */
  onRegionChange(region) {
    this.setState({
      currentRegion: region
    });
  }

  /**
   * Fit the map boundary to all markers
   * @author Loïc Schupbach
   * @method fitToMarkers
   * @return none
   */
  fitToMarkers(){
    let markersCoordinates = [];
    this.state.markers.map(marker => {
      markersCoordinates.push({latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude)});
    });
    if(markersCoordinates.length > 0) {
      this.mapRef.fitToCoordinates(markersCoordinates, {
        edgePadding: {top: 300, right: 200, bottom: 300, left: 200},
        animated: true
      });
    }
  }

  /**
   * Set the circle center coordinates in the state
   * @author Loïc Schupbach
   * @method onMapLongPress
   * @param e {Event}
   * @return none
   */
  onMapLongPress(e){
    let center = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    };
    this.setState({
      circle:{
        center: center,
        radius: this.state.circle.radius
      }
    })
  }

  /**
   * Set the circle radius in the state
   * @author Loïc Schupbach
   * @method onRadiusChange
   * @param e {Event}
   * @return none
   */
  onRadiusChange(e){
    this.setState({
      circle: {
        center: this.state.circle.center,
        radius: Math.round(e)
      }
    })
  }

  /**
   * Show the actionSheet
   * @author Loïc Schupbach
   * @method showActionSheet
   * @return none
   */
  searchCarParks() {
    // this.props.navigation.navigate("Login");
    //this.ActionSheet.show()
    if (this.state.circle.center.latitude == null || this.state.circle.center.longitude == null) {
      ToastAndroid.showWithGravity("Veuillez sélectionner une zone de recherche", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    } else {
      this.setState({
        loading: true
      }, () => {
        API.searchCarPark(this.state.circle.center.latitude, this.state.circle.center.longitude, this.state.circle.radius, this.props.userStore.token, this.props.userStore.tokenType)
          .then(response => {
            if (response.data.results.length == 0) {
              ToastAndroid.showWithGravity("Aucun résultats pour la zone recherchée", ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
            this.setState({
              loading: false,
              markers: response.data.results
            }, () => {
              this.fitToMarkers();
            })
          }).catch(error => {
            console.log(error);
            this.setState({
              loading: false
            })
        });
      });
    }
  }

  /**
   * Open a bottom sheet to display marker informations
   * @author Loïc Schupbach
   * @method openBottomSheet
   * @return none
   */
  openBottomSheet(marker){
    this.setState({
      bottomSheetVisible: true,
      marker: marker
    });
  }

  /**
   * Close the bottom sheet and the marker tooltip
   * @author Loïc Schupbach
   * @method closeBottomSheet
   * @return none
   */
  closeBottomSheet(){
    if(this.state.marker != null) {
      this.refs[this.state.marker.id.toString()].hideCallout();
      this.setState({
        bottomSheetVisible: false
      });
    }
  }

  openAddOccupant(){
    this.props.navigation.navigate("AddOccupant", {carPark: this.state.marker});
  }

  render() {
    let circle = null;
    let centerCircle = null;
    let bottomSheet = null;
    if(this.state.circle.center.latitude != null && this.state.circle.center.longitude != null){
      circle = <Circle center={this.state.circle.center} radius={this.state.circle.radius} strokeColor={'#F39C1D'} strokeWidth={2}/>
      centerCircle = <Circle center={this.state.circle.center} radius={7} strokeColor={'#F39C1D'} strokeWidth={3}/>
    }
    if(this.state.bottomSheetVisible){
      bottomSheet =
        <View style={mapStyles.bottomSheet}>
         <List style={mapStyles.bottomSheetList}>
           <ListItem icon style={mapStyles.bottomSheetListItem}>
            <Left>
               <Icon name="pin" style={globalStyles.icon}/>
             </Left>
             <Body style={mapStyles.bottomSheetListItem}>
                <Text style={mapStyles.bottomSheetText}>{this.state.marker.address}</Text>
              </Body>
          </ListItem>
           <ListItem icon style={mapStyles.bottomSheetListItem}>
             <Left>
               <Icon name="jet" style={globalStyles.icon}/>
             </Left>
             <Body style={mapStyles.bottomSheetListItem}>
             <Text style={mapStyles.bottomSheetText}>{Math.round(this.state.marker.distance)} mètres du point sélectionné</Text>
             </Body>
           </ListItem>
           <ListItem icon style={mapStyles.bottomSheetListItem}>
             <Left>
               <Icon name="cash" style={globalStyles.icon}/>
             </Left>
             <Body style={mapStyles.bottomSheetListItem}>
             <Text style={mapStyles.bottomSheetText}>{this.state.marker.price} CHF / heure</Text>
             </Body>
           </ListItem>
         </List>
          <Button style={mapStyles.bookButton}
            onPress={() => this.openAddOccupant()}>
            <Text style={globalStyles.buttonText}>RÉSERVER</Text>
          </Button>
          {/*<View>*/}
            {/*<Icon name="pin" style={globalStyles.icon} />*/}
            {/*<Text>{this.state.marker.address}</Text>*/}
          {/*</View>*/}
        </View>
    }
    return (
      <View style={globalStyles.container}>
        <Loader
          loading={this.state.loading} text={"Recherche"} />
        {/*Map view*/}
        <View style={mapStyles.mapContainer}>
          <MapView
            ref={(ref) => {this.mapRef = ref}}
            style={mapStyles.map}
            initialRegion={this.state.initalRegion}
            loadingEnabled={true}
            showsUserLocation={this.state.showUserLocation}
            onPress={this.closeBottomSheet.bind(this)}
            onRegionChange={this.onRegionChange.bind(this)}
            onLongPress={this.onMapLongPress.bind(this)}>

            {this.state.markers.map((marker, index) => {
              const coo = {
                latitude: parseFloat(marker.latitude),
                longitude: parseFloat(marker.longitude)
              }
              return <Marker
                key={index}
                ref={marker.id.toString()}
                coordinate={coo}
                pinColor={"#F39C1D"}
                title={"Place de parking"}
                onPress={() => this.openBottomSheet(marker)}>
              </Marker>
            })}

            {circle}
            {centerCircle}
          </MapView>
        </View>
        {/*/!*Controls view*!/*/}
        <View style={mapStyles.controlsContainer}>
          <Text style={mapStyles.infoText}>Appuyez longuement pour positioner la zone de recherche</Text>
          <Text style={mapStyles.infoText}>Rayon de {this.state.circle.radius} mètres</Text>
          <Slider
            style={mapStyles.slider}
            value={this.state.circle.radius}
            maximumValue={3000}
            minimumValue={100}
            minimumTrackTintColor='#F0CC3D'
            maximumVTrackTintColor='#F0CC3D'
            thumbTintColor='#F39C1D'
            onValueChange={this.onRadiusChange.bind(this)}/>
          <Button style={mapStyles.searchButton} onPress={this.searchCarParks.bind(this)}>
            <Text style={globalStyles.buttonText}>RECHERCHER</Text>
          </Button>
        </View>

        {bottomSheet}
      </View>
    );
  }
}
