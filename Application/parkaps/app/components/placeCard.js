import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  View
} from 'react-native';

import {Card, Button, Icon, CardItem, Left, Thumbnail, Body, Text} from 'native-base';

import {globalStyles} from "../style";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export class PlaceCard extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      carPark: props.carPark
    }
  }

  showDetails(){
    this.props.onPress(this.state.carPark)
  }

  render() {
    const {carPark} = this.state
    return (
      <Card button  style={styles.card}>
        <CardItem button  style={styles.cardItem} onPress={() => this.showDetails()}>
          <Left>
            <Thumbnail source={{uri: 'https://picsum.photos/200'}}/>
            <Body>
              <Text>Place de parking</Text>
              <Text note>{carPark.address}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem button style={styles.cardItem} onPress={() => this.showDetails()}>
          <Body>
          <Image source={{uri: 'https://picsum.photos/100/300'}} style={{height: 100, width: 300, flex: 1}}/>
          <Text>
            {carPark.latitude} | {carPark.longitude}
          </Text>
          </Body>
        </CardItem>
        <CardItem style={styles.cardItem}>
          <Left>
            <Button iconLeft transparent>
              <Icon name="locate" style={globalStyles.icon}/>
              <Text style={globalStyles.icon}>Voir sur la carte</Text>
            </Button>
          </Left>
        </CardItem>
      </Card>
    )
  }
};
const styles = StyleSheet.create({
  card: {
    width: WIDTH / 100 * 95,
    marginLeft: WIDTH / 100 * 2.5,
    backgroundColor: '#353A50',
    borderColor: '#353A50',
    borderRadius: 15
  },
  cardItem: {
    backgroundColor: '#353A50',
  },
  headerText: {
    fontSize: 10
  },
  moreButton: {
    width: WIDTH / 100 * 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
