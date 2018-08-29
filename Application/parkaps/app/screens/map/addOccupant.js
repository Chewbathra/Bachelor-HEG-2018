import React from "react";

import {ScrollView, Text, View, Modal, TimePickerAndroid, DatePickerAndroid, Alert} from "react-native";
import {Button, Header, Body, Left, Title, Icon, List, ListItem, Form, Item, Input} from 'native-base'
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
      markedDates: {},
      occupants: [],
      displayDates: [],
      selectedDay: null,
      visible: false,

      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null
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
    this.fetchData();
  }

  fetchData(){
    this.setState({
      dailyAvailabilities: [],
      availabilities: [],
      markedDates: {},
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      displayDates: [],
      selectedDay: null
    }, () => {
      this.fetchOccupants().then(occupants => {
        this.setState({
          occupants: occupants.data.occupants
        });
        this.fetchAvailabilities().then(async response => {
          let length = response.data.availabilities.length;
          for(let i = 0; i < length; i++){
            for(let j = 0; j < occupants.data.occupants.length; j++){
              const occupant = occupants.data.occupants[j];
              let start = new Date(response.data.availabilities[i].start);
              let end = new Date(response.data.availabilities[i].end);
              const occupantStart = new Date(occupant.start);
              const occupantEnd = new Date(occupant.end);
              if(occupantStart >= start){
                if(occupantEnd <= end){
                  if(occupantStart.getTime() === start.getTime() && occupantEnd.getTime() === end.getTime()){
                    response.data.availabilities.splice(i,1);
                    break;
                  } else {
                    if(occupantStart > start){
                      if(occupantEnd.getTime() === end.getTime()){
                        response.data.availabilities.splice(i,1);
                        response.data.availabilities.push({
                          start: start,
                          end: occupantStart
                        })
                      } else {
                        response.data.availabilities[i].start = new Date(occupantEnd);
                        response.data.availabilities.push({
                          start: start,
                          end: occupantStart
                        })
                      }
                    } else {
                      response.data.availabilities[i].start = new Date(occupantEnd);
                    }
                  }
                }
              } else if (occupantEnd <= end && occupantStart < start){
                if(occupantEnd.getTime() === end.getTime()){
                  response.data.availabilities.splice(i,1);
                  break;
                } else {
                  response.data.availabilities[i].start = new Date(occupantEnd);
                }
              } else if(occupantStart >= start && occupantEnd >= end){
                if(occupantStart.getTime() === start.getTime()){
                  response.data.availabilities.splice(i,1);
                  break;
                } else {
                  response.data.availabilities.splice(i,1);
                  response.data.availabilities.push({
                    start: start,
                    end: occupantStart
                  })
                  break;
                }
              }
            }
            length = response.data.availabilities.length;
          }

          await this.asyncForEach(response.data.availabilities, async (availability) => {
            const start = new Date(availability.start);
            const end = new Date(availability.end);
            const dates = this.getDatesBetween(start, end);
            await this.displayMarkedDate(dates, start, end)
          });
          this.setState({
            availabilities: response.data.availabilities,
            dailyAvailabilities: response.data.daily_availabilities,
            loading: false
          });
        }).catch(error => {
          console.log(error);
          this.setState({
            loading: false
          });
        });
      }).catch(error => {
        console.log(error);
        this.setState({
          loading: false
        });
      });
    });
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

  formatOnlyDate(date){
    const day = date.getDate();
    let monthIndex = date.getMonth();
    const year = date.getFullYear();

    if(monthIndex < 10){
      monthIndex = "0" + monthIndex;
    }

    return day + '/' + monthIndex + '/' + year;
  }

  formatOnlyTime(date){

    const hour = date.getHours();
    let minutes = date.getMinutes();

    if(minutes < 10){
      minutes = "0" + minutes;
    }

    return hour + ':' + minutes;
  }

  fetchAvailabilities(){
    return new Promise((resolve, reject) => {
      API.searchavailabilities(this.state.carPark.id, this.props.userStore.token, this.props.userStore.tokenType)
        .then(async response => {
          if(response.status === 200){
            resolve(response);
          } else {
            reject(response);
          }
        }).catch(error => {
          reject(error);
        })
    });
  }

  fetchOccupants(){
    return new Promise((resolve, reject) => {
      API.getOccupantsForCarPark(this.state.carPark.id, this.props.userStore.token, this.props.userStore.tokenType)
        .then(response => {
          if(response.status === 200){
            resolve(response);
          } else {
            reject(response);
          }
        }).catch(error => {
          reject(error);
        });
    });
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
    endDate.setHours(23);
    endDate.setMinutes(59);
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
      dates.forEach(date => {
        newMarkedDates[date] = {color: '#c97852'}
      });

      this.setState({
        markedDates: newMarkedDates
      }, () => resolve(true));
    })
  }

  displaySelectedDay(day){
    let startDate = new Date(day.timestamp);
    let endDate = new Date(day.timestamp)
    startDate.setHours(23);
    startDate.setMinutes(59);
    endDate.setHours(0);
    endDate.setMinutes(1);
    const availabilities = this.state.availabilities;
    const display = [];
    availabilities.forEach(availability => {
      const start = new Date(availability.start).getTime();
      const end = new Date(availability.end).getTime();
      if(startDate.getTime() >=  start && endDate.getTime() <= end){
        display.push(availability);
      }
    });
    this.setState({
      selectedDay: startDate,
      displayDates: display.reverse()
    })
  }

  createOccupant(){
    this.setState({
      visible: true
    })
  }

  /**
   * Display start date selector
   */
  setStartDate(){
    this.openDatePicker().then(response => {
      this.setState({
        startDate: response
      })
    })
  }

  /**
   * Display end date selector
   */
  setEndDate(){
    this.openDatePicker().then(response => {
      this.setState({
        endDate: response
      })
    })
  }

  /**
   * Display start time selector
   */
  setStartTime(){
    this.openTimePicker().then(response => {
      this.setState({
        startTime: response
      })
    });
  }

  /**
   * Display end time selector
   */
  setEndTime(){
    this.openTimePicker().then(response => {
      this.setState({
        endTime: response
      })
    });
  }

  /**
   * Open a date picker
   * @author Loïc Schupbach
   * @param {Date} [date=new Date()]
   */
  openDatePicker(minDate = new Date(), date = new Date()){
    return new Promise(async (resolve, reject) => {
      try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          date: date,
          minDate: minDate,
          mode: 'calendar'
        });
        if (action !== DatePickerAndroid.dismissedAction) {

          if(action == 'dateSetAction'){
            resolve(new Date(year, month, day));
          } else {
            reject(action);
          }
        }
      } catch (error) {
        console.warn('Cannot open date picker', error.message);
        reject(error);
      }
    });
  }

  /**
   * Open a time picker
   * @author Loïc Schupbach
   * @param {Number} [hour=new Date().getHours()]
   * @param {Number} [minute=new Date().getMinutes()]
   */
  openTimePicker(hour = new Date().getHours(), minute = new Date().getMinutes()){
    return new Promise(async(resolve, reject) => {
      try {
        const {action, hour, minute} = await TimePickerAndroid.open({
          hour: hour,
          minute: minute,
          is24Hour: true, // Will display '2 PM',
          mode: 'spinner'
        });
        if (action !== TimePickerAndroid.dismissedAction) {
          if(action == 'timeSetAction'){
            let d = new Date();
            d.setHours(hour);
            d.setMinutes(minute);
            resolve(d);
          } else {
            reject(action);
          }
        }
      } catch (error) {
        console.warn('Cannot open date picker', error.message);
        reject(error);
      }
    });
  }

  saveOccupant(){
    this.setState({
      loading: true
    }, () => {
      let start = this.state.startDate;
      let end = this.state.endDate;
      start.setHours(this.state.startTime.getHours());
      start.setMinutes(this.state.startTime.getMinutes());
      end.setHours(this.state.endTime.getHours());
      end.setMinutes(this.state.endTime.getMinutes());
      if(start >= end){
        Alert.alert(
          'Erreur',
          "La date de fin doit être après la date de début"
        );
        this.setState({
          loading: false
        });
      } else {

        let errorAvailability = true;
        this.state.availabilities.forEach(availabilities => {
          if(start >= new Date(availabilities.start) && end <= new Date(availabilities.end)){
            errorAvailability = false;
          }
        });
        if(errorAvailability){
          this.state.dailyAvailabilities.forEach(daily => {
            const dailyStart = new Date(daily.start);
            const dailyEnd = new Date(daily.end);
            if(start.getHours() >= dailyStart.getHours() && start.getMinutes() >= dailyStart.getMinutes() && end.getHours() <= dailyEnd.getHours() && end.getMinutes() <= dailyEnd.getMinutes()){
              errorAvailability = false;
            }
          });
        }
        let error = false;
        if(errorAvailability === false){
          this.state.occupants.forEach(occupant => {
            if(start >= occupant.start){
              if(start <= occupant.end){
                error = true;
              }
            } else {
              if(end >= occupant.start){
                error = true;
              }
            }
          });
        }

        if(errorAvailability){
          Alert.alert(
            'Erreur',
            "L'horaire que vous voulez réserver n'existe pas pour cette place de parking"
          );
          this.setState({
            loading: false,
            visible: false
          });
        } else if(error){
          Alert.alert(
            'Erreur',
            "L'horaire que vous voulez réserver a déjà été réservé par un autre utilisateur"
          );
          this.setState({
            loading: false,
            visible: false
          });
        } else {
          API.createOccupant(start, end, this.state.carPark.id, this.props.userStore.token, this.props.userStore.tokenType)
            .then(response => {
              this.setState({
                visible: false
              });
              this.fetchData();
            })
            .catch(error => {
              console.log(error);
              this.setState({
                loading: false
              })
            })
        }
      }
    });
  }

  render() {

    return (
      <View style={addOccupantStyles.container}>
        <Loader
          loading={this.state.loading} text={"Chargement"} />
        <Header style={globalStyles.header} androidStatusBarColor='#000000'>
          <Left>
            <Button transparent
                    onPress={() => this.props.navigation.pop()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
          <Title>Réserver la place</Title>
          </Body>
        </Header>
        <ScrollView>
          <Title style={addOccupantStyles.title}>Informations</Title>
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
          </List>
          <View style={addOccupantStyles.separator}>
            <Title style={addOccupantStyles.title}>Horaires journaliers</Title>
            {this.state.dailyAvailabilities.map(dailyAvailability => {
              const start = new Date(dailyAvailability.start);
              const end = new Date(dailyAvailability.end);
              return (
                <Text key={dailyAvailability.id} style={addOccupantStyles.dailyAvailabilitiesItem}>{start.toLocaleTimeString().slice(0, -3)} à {end.toLocaleTimeString().slice(0, -3)}</Text>
              )
            })}
            {this.state.dailyAvailabilities.length == 0 ? <Text style={addOccupantStyles.dailyAvailabilitiesItem}>Aucun horaires journaliers pour cette place</Text>: null}
          </View>
          <View style={addOccupantStyles.separator}>
            <Title style={addOccupantStyles.title}>Horaires normaux</Title>
            <CalendarList
              style={addOccupantStyles.calendar}
              // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
              minDate={new Date()}
              horizontal={true}
              pagingEnabled={true}
              pastScrollRange={0}
              futureScrollRange={6}
              // Handler which gets executed on day press. Default = undefined
              onDayPress={(day) => this.displaySelectedDay(day)}
              // Do not show days of other months in month page. Default = false
              // hideExtraDays={true}
              // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
              // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
              firstDay={1}
              markingType={'period'}
              markedDates={this.state.markedDates}
              theme={{
                calendarBackground: '#2A2E43',
                monthTextColor: '#F0CC3D',
                textSectionTitleColor: '#F0CC3D',
                dayTextColor: 'white',
                todayTextColor: '#F39C1D',
                selectedDayTextColor: '#F0CC3D',
                selectedDayBackgroundColor: '#F0CC3D',
                textDisabledColor: 'gray',
                'stylesheet.day.basic' : {
                  selected: {
                    backgroundColor: 'red',
                    borderRadius: 16
                  },
                }
              }}
            />
            <View style={addOccupantStyles.availabilities}>
              {this.state.selectedDay === null ? null : <Title style={addOccupantStyles.availabilitiesTitle}>Horaires disponible pour le {this.state.selectedDay.getDate()}/{this.state.selectedDay.getMonth()}/{this.state.selectedDay.getFullYear()}</Title>}

            {this.state.displayDates.map(date => {
              const start = new Date(date.start);
              const end = new Date(date.end);
              return (
                <Text key={'test' + start.getTime() + end.getTime()} style={addOccupantStyles.availabilitiesItem}>Du {this.formatDate(start)} au {this.formatDate(end)}</Text>
              )
            })}
            </View>
          </View>
          <Button bordered rounded style={addOccupantStyles.addOccupantButton}
                  onPress={() => this.createOccupant()}>
            <Text style={globalStyles.buttonText}>Réserver</Text>
          </Button>
        </ScrollView>
        <Modal
          transparent={true}
          animationType={'fade'}
          onRequestClose={() => {}}
          visible={this.state.visible}>
          <View style={addOccupantStyles.modalBackground}>
            <View style={addOccupantStyles.modalContainer}>
              <Text style={addOccupantStyles.modalTitle}>Création d'une réservation</Text>
              <Form >
                <Item style={addOccupantStyles.input}>
                  <Icon name='clock' style={globalStyles.icon}/>
                  <Input placeholder="Date de début" placeholderTextColor="#959DAD" ref="start" editable={false}
                         value={this.state.startDate == null ? '' : this.formatOnlyDate(this.state.startDate)}/>
                  <Button warning style={addOccupantStyles.inputButton}
                          onPress={() => this.setStartDate()}>
                    <Icon name='create' />
                  </Button>
                </Item>
                <Item style={addOccupantStyles.input}>
                  <Icon name='clock' style={globalStyles.icon}/>
                  <Input placeholder="Heure de début" placeholderTextColor="#959DAD" ref="start" editable={false}
                         value={this.state.startTime == null ? '' : this.formatOnlyTime(this.state.startTime)}/>
                  <Button warning style={addOccupantStyles.inputButton}
                          onPress={() => this.setStartTime()}>
                    <Icon name='create' />
                  </Button>
                </Item>
                <Item style={addOccupantStyles.input}>
                  <Icon name='clock' style={globalStyles.icon}/>
                  <Input placeholder="Date de fin" placeholderTextColor="#959DAD" ref="end" editable={false}
                         value={this.state.endDate == null ? '' : this.formatOnlyDate(this.state.endDate)}/>
                  <Button warning style={addOccupantStyles.inputButton}
                          onPress={() => this.setEndDate()}>
                    <Icon name='create' />
                  </Button>
                </Item>
                <Item style={addOccupantStyles.input}>
                  <Icon name='clock' style={globalStyles.icon}/>
                  <Input placeholder="Heure de fin" placeholderTextColor="#959DAD" ref="start" editable={false}
                         value={this.state.endTime == null ? '' : this.formatOnlyTime(this.state.endTime)}/>
                  <Button warning style={addOccupantStyles.inputButton}
                          onPress={() => this.setEndTime()}>
                    <Icon name='create' />
                  </Button>
                </Item>
              </Form>
              <Button
                onPress={() => this.saveOccupant()}
                style={addOccupantStyles.sendButton}>
                <Text>Enregistrer</Text>
              </Button>
              <Button
                onPress={() => this.setState({visible: false, startDate: null, endDate: null, startTime: null, endTime: null})}
                style={addOccupantStyles.sendButton}>
                <Text>Annuler</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
