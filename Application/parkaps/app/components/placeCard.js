import React from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';

import {Card, Button, Icon, CardItem, Left, Thumbnail, Body, Text, List, ListItem} from 'native-base';

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
              <Text>{carPark.address}</Text>
              <Text note>{carPark.latitude} | {carPark.longitude}</Text>
            </Body>
            <Icon name="build" style={globalStyles.icon}/>
          </Left>
        </CardItem>
        <CardItem style={styles.cardItem}>
          <List>
              <ListItem style={styles.listItem}>
                  <Icon name="cash" style={globalStyles.icon}/>
                  <Text  style={styles.itemText}>{carPark.price}</Text>
              </ListItem>
              <ListItem  style={styles.listItem}>
                <Icon name="book" style={globalStyles.icon}/>
                <Text style={styles.itemText}>{carPark.description}</Text>
              </ListItem>
            </List>
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
  },
  listItem: {
    borderBottomWidth: 0
  },
  itemText: {
    marginLeft: 10,
    marginRight: 10
  },
});
