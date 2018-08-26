import React from "react";

import { ScrollView, Text } from "react-native";
import {Button, Header, Body, Left, Title, Icon, List, ListItem} from 'native-base'
import {inject} from 'mobx-react';
import {API} from "../../config/provider";

import {CalendarList, LocaleConfig} from 'react-native-calendars'

import {Loader} from "../../components/loader";
import {globalStyles, addOccupantStyles} from "../../style";

@inject('userStore')
export class AddOccupantScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      carPark: this.props.navigation.getParam('carPark', {}),
      loading: true,
      dailyAvailabilities: [],
      availabilities: [],
      markedDates: {}
    }

    LocaleConfig.locales['fr'] = {
      monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
      dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
      dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
    }
    LocaleConfig.defaultLocale = 'fr';
  }

  componentDidMount(){
    this.fetchAvailabilities();
    this.fetchOccupants();
  }

  fetchAvailabilities(){
    this.setState({
      items: {},
      dailyAvailabilities: [],
      availabilities: [],
      markedDates: {}
    }, () => {
      API.searchavailabilities(this.state.carPark.id, this.props.userStore.token, this.props.userStore.tokenType)
        .then(async response => {
          console.log(response);
          if(response.status === 200){

            await this.asyncForEach(response.data.availabilities, async (availability) => {
              const start = new Date(availability.start);
              const end = new Date(availability.end);
              const dates = this.getDatesBetween(start, end);
              await this.displayMarkedDate(dates, start, end)
            });
            console.log(this.state.markedDates);
            this.setState({
              dailyAvailabilities: response.data.daily_availabilities,
              loading: false
            })
          } else {
            this.setState({
              loading: false
            });
          }
        }).catch(error => {
        console.log(error);
        this.setState({
          loading: false
        });
      })
    })
  }

  fetchOccupants(){
    API.getOccupantsForCarPark(this.state.carPark.id, this.props.userStore.token, this.props.userStore.tokenType)
      .then(response => {
        console.log(response);
      }).catch(error => {
        console.log(error);
    })
  }

  /**
   * Asynchronous foreach
   * @param {Array} array - The array to do the foreach on
   * @param {Callback} callback - The callback method to send the current value in the foreach
   * @return {Promise<void>}
   */
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

  /**
   * Return an array of ISO formated dates
   * @param {Date} startDate
   * @param {Date} endDate
   * @return {Array} - Dates between given dates
   */
  getDatesBetween(startDate, endDate) {
    let dateArray = [];
    let currentDate = new Date(startDate);
    // const stopDate = new Date(endDate.setDate(endDate.getDate() + 1));
    while (currentDate <= endDate) {
      dateArray.push( currentDate.toISOString().split('T')[0] );
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    return dateArray;
  }

  /**
   * Create markedDates for displaying
   * @param {Array} dates - Dates to save
   * @param {Date} start - Starting date
   * @param {Date} end - End date
   * @param {boolean} daily - Is this daily
   * @param {number} availabilityId - Id of this availability
   * @return {Promise<any> | Promise}
   */
  displayMarkedDate(dates, start, end){
    return new Promise((resolve) => {
      let newMarkedDates = Object.assign({}, this.state.markedDates);
      console.log(dates, start, end);
      dates.forEach(date => {
        newMarkedDates[date] = {color: '#c97852'}
      });

      this.setState({
        markedDates: newMarkedDates
      }, () => resolve(true));
    })
  }


  render() {

    return (
      <ScrollView style={addOccupantStyles.container}>
        <Loader
          loading={this.state.loading} text={"Chargement"} />
        <Header style={globalStyles.header} androidStatusBarColor='#000000'>
          <Left>
            <Button transparent
                    onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
          <Title>Réserver la place</Title>
          </Body>
        </Header>
        <List style={addOccupantStyles.list}>
          <ListItem icon style={addOccupantStyles.listItem}>
            <Left>
              <Icon name="pin" style={globalStyles.icon}/>
            </Left>
            <Body style={addOccupantStyles.listItem}>
            <Text style={addOccupantStyles.listText}>{this.state.carPark.address}</Text>
            </Body>
          </ListItem>
          <ListItem icon style={addOccupantStyles.listItem}>
            <Left>
              <Icon name="jet" style={globalStyles.icon}/>
            </Left>
            <Body style={addOccupantStyles.listItem}>
            <Text style={addOccupantStyles.listText}>{Math.round(this.state.carPark.distance)} mètres du point sélectionné</Text>
            </Body>
          </ListItem>
          <ListItem icon style={addOccupantStyles.listItem}>
            <Left>
              <Icon name="cash" style={globalStyles.icon}/>
            </Left>
            <Body style={addOccupantStyles.listItem}>
            <Text style={addOccupantStyles.listText}>{this.state.carPark.price} CHF / heure</Text>
            </Body>
          </ListItem>
          <ListItem icon style={addOccupantStyles.listItem}>
            <Left>
              <Icon name="book" style={globalStyles.icon}/>
            </Left>
            <Body style={addOccupantStyles.listItem}>
            <Text style={addOccupantStyles.listText}>{this.state.carPark.description}</Text>
            </Body>
          </ListItem>
          <ListItem>
            <Text>Horaires journaliers</Text>
            {this.state.dailyAvailabilities.map(dailyAvailability => {
              const start = new Date(dailyAvailability.start);
              const end = new Date(dailyAvailability.end);
              return (
                <Text key={dailyAvailability.id}>{start.toLocaleDateString().slice(0, -3)} à {end.toLocaleDateString().slice(0, -3)}</Text>
              )
            })}
          </ListItem>
        </List>
        <CalendarList
          style={addOccupantStyles.calendar}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={new Date()}
          horizontal={true}
          pagingEnabled={true}
          pastScrollRange={0}
          futureScrollRange={6}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {console.log('selected day', day)}}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out


          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          markingType={'period'}
          markedDates={this.state.markedDates}
        />
        <Button bordered rounded style={addOccupantStyles.addOccupantButton}
                >
          <Text style={globalStyles.buttonText}>Réserver</Text>
        </Button>
      </ScrollView>
    );
  }
}
