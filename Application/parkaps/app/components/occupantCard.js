import React from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';

import {Card, Button, Icon, CardItem, Left, Thumbnail, Body, Text, List, ListItem} from 'native-base';

import {globalStyles} from "../style";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export class OccupantCard extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      occupant: props.occupant
    }
  }

  deleteOccupant(){
    this.props.onDelete(this.state.occupant);
  }

  formatDate(date) {
    const monthNames = [
      "Janvier", "Février", "Mars",
      "AVril", "Mai", "Juin", "Juillet",
      "Août", "Septembre", "Octobre",
      "Novembre", "Décembre"
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hour = date.getHours();
    let minutes = date.getMinutes();

    if(minutes < 10){
      minutes = "0" + minutes;
    }

    return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hour + ':' + minutes;
  }


  render() {
    const {occupant} = this.state;
    return (
      <Card button  style={styles.card}>
        <CardItem button style={styles.cardItem} onPress={() => this.deleteOccupant()}>
          <Left>
            <Body>
              <Text style={styles.text}>Du {this.formatDate(new Date(occupant.start))}</Text>
              <Text style={styles.text}>au {this.formatDate(new Date(occupant.end))}</Text>
            </Body>
            <Icon name="trash" style={[globalStyles.icon, styles.icon]}/>
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
  },
  listItem: {
    borderBottomWidth: 0
  },
  itemText: {
    marginLeft: 10,
    marginRight: 10
  },
  text: {
    color: 'white'
  },
  icon: {
    color: 'red'
  }
});
