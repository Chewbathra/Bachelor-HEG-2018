import React from "react";
import {View, ToastAndroid, DatePickerAndroid, TimePickerAndroid, Alert} from "react-native";
import {inject} from 'mobx-react';
import {API} from '../../config/provider';
import { LocaleConfig, Agenda } from 'react-native-calendars';


import {globalStyles, addScheduleStyles, profileStyles} from "../../style";
import {Header, Icon, Body, Title, Form, Item, Input, Button, Left, Text} from 'native-base';
import {Loader} from "../../components/loader";

@inject('userStore')
export class AddScheduleScreen extends React.Component {


  constructor(props){
    super(props);
    this.state = {
      loading: false,
      errors: [],
      carPark: props.navigation.getParam('carPark', {
        address: 'ID: 1',
        id: 1
      }),
      selectedDay: null,
      items: {},
      dailyItems: []
    };

    this.saveDatesToItems = this.saveDatesToItems.bind(this);
    this.saveTimeToDailyItems = this.saveTimeToDailyItems.bind(this);
    this.goToProfile = this.goToProfile.bind(this);

    LocaleConfig.locales['fr'] = {
      monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
      dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
      dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
    }
    LocaleConfig.defaultLocale = 'fr';
  }

  componentDidMount(){
    this.fetchAvailabilites();
  }

  goToProfile(){

    console.log(this.props.userStore.tokenType);
    this.props.navigation.navigate("Profile");
    this.props.navigation.getParam('update')();
  }

  /**
   * Fetch all availabilites for the current car park id
   */
  fetchAvailabilites(){
    this.setState({
      loading: true
    }, () => {
      API.searchavailabilities(this.state.carPark.id, this.props.userStore.token, this.props.userStore.tokenType)
        .then(async res => {
          const availabilites = Object.values(res.data.availabilites);
          await this.asyncForEach(availabilites, async (availability) => {
            if(availability.daily){
              await this.saveTimeToDailyItems(new Date(availability.start), new Date(availability.end), availability.id)
                .catch((error) => {
                  console.log(error);
                  this.setState({
                    loading: false
                  })
                })
            } else {
              const dates = this.getDatesBetween(new Date(availability.start), new Date(availability.end));
              await this.saveDatesToItems(dates, new Date(availability.start), new Date(availability.end), availability.id)
                .catch((error) => {
                  console.log(error);
                  this.setState({
                    loading: false
                  })
                })
            }
          });
          this.setState({
            loading: false
          })
        }).catch(error => {
        console.log(error);
      })
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
   * Display alerts and picker to select a new schedule
   * @author Loïc Schupbach
   */
  async onScheduleAdd(){
    this.openAlert("Début", "Veuillez sélectionner la date de début. Si vous voulez créer un horaire journalier, choisissez la même date avec 2 heures différentes", false);
    setTimeout(() => {

      this.openDatePicker().then(firstDate => {
        const startDate = new Date(firstDate.year, firstDate.month, firstDate.day);
        this.openAlert("Début", "Veuillez sélectionner l'heure de début", true);

        this.openTimePicker(startDate).then(firstTime => {
          this.openAlert("Fin", "Veuillez sélectionner la date de fin", true);

          this.openDatePicker().then(secondDate => {
            const endDate = new Date(secondDate.year, secondDate.month, secondDate.day);
            this.openAlert("Fin", "Veuillez sélectionner l'heure de fin", true);

            this.openTimePicker(firstTime.hour, firstTime.minute).then(secondTime => {

              if(startDate.getTime() === endDate.getTime()){
                if(firstTime.hour > secondTime.hour){
                  this.openAlert("Données incohérentes", "Les dates et heures que vous avez donné sont incohérentes !");
                } else {
                  if(firstTime.hour === secondTime.hour && firstTime.minute >= secondTime.minute){
                    this.openAlert("Données incohérentes", "Les dates et heures que vous avez donné sont incohérentes !");
                  } else {
                    startDate.setHours(firstTime.hour);
                    startDate.setMinutes(firstTime.minute);
                    endDate.setHours(secondTime.hour);
                    endDate.setMinutes(secondTime.minute);

                    Alert.alert(
                      "Demande complémentaire",
                      "Voulez-vous que cet horaire soit enregistré de manière journalière ?",
                      [
                        {text: 'Oui', onPress: () => this.saveDate(startDate, endDate, true)},
                        {text: 'Non', onPress: () => this.saveDate(startDate, endDate)},
                      ],
                      { cancelable: false }
                    );
                  }
                }
              } else if(startDate.getTime() < endDate.getTime()){
                startDate.setHours(firstTime.hour);
                startDate.setMinutes(firstTime.minute);
                endDate.setHours(secondTime.hour);
                endDate.setMinutes(secondTime.minute);

                this.saveDate(startDate, endDate);
              } else {
                this.openAlert("Données incohérentes", "Les dates et heures que vous avez donné sont incohérentes !");
              }
            })
          })
        })
      })
    },10);
  }

  /**
   * Save the dates to the backend database
   * @author Loïc Schupbach
   * @param {Date} startDate
   * @param {Date} endDate
   * @param {boolean} [daily=false]
   */
  saveDate(startDate, endDate, daily = false){
    this.setState({
      loading: true
    }, () => {
      API.createAvailability(startDate.getTime(), endDate.getTime(), daily, this.state.carPark.id, this.props.userStore.token, this.props.userStore.tokenType)
        .then(res => {
          if(res.data.created.daily){
            this.saveTimeToDailyItems(startDate, endDate, res.data.created.id)
              .then(() => {
                this.loadItems({
                  timestamp: startDate.getTime()
                });
                this.setState({
                  loading: false
                });
              });
          } else {
            this.saveDatesToItems(this.getDatesBetween(startDate, endDate), startDate, endDate, res.data.created.id)
              .then(() => {
                this.setState({
                  loading: false
                });
              });
          }
        }).catch(error => {
        console.log(error);
        this.setState({
          loading: false
        })
      })
    });
  }

  /**
   * Save all dates to items for calendar
   * @param {Array} dates - Dates to save
   * @param {Date} start - Starting date
   * @param {Date} end - End date
   * @param {boolean} daily - Is this daily
   * @param {number} availabilityId - Id of this availability
   * @return {Promise<any> | Promise}
   */
  saveDatesToItems(dates, start, end, availabilityId){
    return new Promise((resolve) => {
      let name = "Du " + start.toLocaleString() + " au " + end.toLocaleString();
      let newItems = this.state.items;
      let item = {
        name: name,
        id: availabilityId,
        height: 80,
        backgroundColor: 'white'
      };
      dates.forEach(date => {
        if(newItems[date] !=  null) {
          newItems[date].push(item);
        } else {
          newItems[date] = [item]
        }
      });
      this.setState({
        items: newItems
      }, () => resolve(true));
    })
  }

  /**
   * Save date to daily items
   * @param {Date} start
   * @param {Date} end
   * @param {number} availabilityId
   * @return {Promise<any> | Promise}
   */
  saveTimeToDailyItems(start, end, availabilityId){
    return new Promise((resolve) => {
      const startMinutes = ("0" + start.getMinutes()).slice(-2);
      const endMinutes = ("0" + end.getMinutes()).slice(-2);
      const item = {
        name: "Journalièrement de " + start.getHours() + ":" + startMinutes + " à " + end.getHours() + ":" + endMinutes,
        id: availabilityId,
        height: 80,
        backgroundColor: 'gray'
      };
      let newItems = this.state.dailyItems;
      newItems.push(item);
      this.setState({
        dailyItems: newItems
      }, () => resolve(true))
    });
  }

  /**
   * Delete the selected availability
   * @param availability
   */
  deleteAvailability(availability){
    API.deleteAvailability(availability, this.props.userStore.token, this.props.userStore.tokenType)
      .then((res) => {
        let items = this.state.items;
        const itemKeys = Object.keys(items);
        itemKeys.forEach(key => {
         for(let i = items[key].length - 1; i >= 0; i--){
           if(items[key][i].id === availability.id){
             items[key].splice(i,1);
           }
         }
        });

        let dailyItems = this.state.dailyItems;
        for(let i = dailyItems.length - 1; i >= 0; i--){
          if(dailyItems[i].id === availability.id){
            dailyItems.splice(i,1);
          }
        }
        this.setState({
          items: items,
          dailyItems: dailyItems
        }, () => {
          ToastAndroid.showWithGravity(
            'Horaire supprimé correctement',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        });
      }).catch((error) => {
        this.openAlert(error.code, error.message);
    })
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
   * Open an alert
   * @author Loïc Schupbach
   * @param {string} title
   * @param {string} text
   * @param {boolean} [cancelable=false]
   * @param {Array<Object>} [buttons=[{text: 'Ok}]]
   * @param {string} buttons.text - The text to display in a button
   * @param {Callback} buttons.onPress
   */
  openAlert(title, text, cancelable = false, buttons = [{text: 'Ok'}]){
    Alert.alert(
      title,
      text,
      buttons,
      { cancelable: cancelable }
    )
  }

  /**
   * Open a date picker
   * @author Loïc Schupbach
   * @param {Date} [date=new Date()]
   */
  openDatePicker(date = new Date()){
    return new Promise(async (resolve, reject) => {
      try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          date: date,
          minDate: new Date()
        });
        if (action !== DatePickerAndroid.dismissedAction) {

          if(action == 'dateSetAction'){
            resolve({
              day: day,
              month: month,
              year: year
            });
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
          is24Hour: true, // Will display '2 PM'
        });
        if (action !== TimePickerAndroid.dismissedAction) {
          if(action == 'timeSetAction'){
            resolve({
              hour: hour,
              minute: minute
            });
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
   * Load daily items for 7 day before and 7 day after clicked date
   * @param day
   */
  loadItems(day){
    this.setState({
      loading: true
    }, () => {
      const dailyItems = this.state.dailyItems;
      if(dailyItems.length > 0) {
        const newItems = this.state.items;
        const date = new Date(day.timestamp);
        const start = new Date(date).setDate(date.getDate() - 7);
        const end = new Date(date).setDate(date.getDate() + 7);
        const dates = this.getDatesBetween(start, end);
        dates.forEach(dateDay => {
          if(newItems[dateDay] == null || !this.containDailyItem(newItems[dateDay], dailyItems[0])){
            if (newItems[dateDay] != null) {
              dailyItems.forEach(dailyItem => {
                newItems[dateDay].push(dailyItem);
              });
            } else {
              newItems[dateDay] = [dailyItems[0]];
              for (let i = 1; i < dailyItems.length; i++) {
                newItems[dateDay].push(dailyItems[i]);
              }
            }
          }
        })
        this.setState({
          items: newItems,
          loading: false
        })
      }
      this.setState({
        loading: false
      })
    })
  }

  /**
   * Watch if array contain this specific item (comparison with id)
   * @param {Array} array
   * @param {Object} item
   * @return {boolean} - Return true if contain
   */
  containDailyItem(array, item){
    for(let i = 0; i < array.length; i++){
      if(array[i].id === item.id) return true;
    }
    return false;
  }

  renderItem(item) {
    return (
      <View style={[addScheduleStyles.item, {height: item.height, backgroundColor: item.backgroundColor}]}>
        <Text style={addScheduleStyles.itemText}>{item.name}</Text>
        <Button bordered  danger rounded style={[addScheduleStyles.itemButton, {height: item.height - 17}]}
          onPress={() => this.deleteAvailability(item)}>
          <Icon name="trash"/>
        </Button>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={addScheduleStyles.emptyDate}><Text style={addScheduleStyles.emptyDateText}>Aucun horaire pour cette journée</Text></View>
    );
  }

  renderEmptyData(){
    return (
      <View style={addScheduleStyles.emptyData}>
        <Text style={[globalStyles.buttonText, addScheduleStyles.addressText]}>Aucun horaires pour cette journée</Text>
      </View>
    )
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  render() {
    return (
      <View style={addScheduleStyles.container}>
        <Loader
          text="Enregistrement"
          loading={this.state.loading} />
        <Header style={globalStyles.header} androidStatusBarColor='#000000'>
          <Left>
            <Button transparent
                onPress={() => this.goToProfile()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
            <Title>Modification des horaires</Title>
          </Body>
        </Header>
        <Text style={[globalStyles.buttonText, addScheduleStyles.addressText]}>{this.state.carPark.address}</Text>
        <Button bordered rounded style={addScheduleStyles.addScheduleButton}
          onPress={() => this.onScheduleAdd()}>
          <Text style={addScheduleStyles.addScheduleButtonText}>Ajouter un horaire</Text>
        </Button>
        <Agenda
          ref={(ref) => this.agenda = ref }
          style={addScheduleStyles.calendar}
          firstDay={1}
          minDate={new Date()}
          pastScrollRange={12}
          futureScrollRange={12}

          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          // calendarHeight={Dimensions.get('window').height / 100 * 75}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          renderEmptyData = {this.renderEmptyData.bind(this)}
          // markingType={'period'}
          // markedDates={{
          //    '2017-05-08': {textColor: '#666'},
          //    '2017-05-09': {textColor: '#666'},
          //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
          //    '2017-05-21': {startingDay: true, color: 'blue'},
          //    '2017-05-22': {endingDay: true, color: 'gray'},
          //    '2017-05-24': {startingDay: true, color: 'gray'},
          //    '2017-05-25': {color: 'gray'},
          //    '2017-05-26': {endingDay: true, color: 'gray'}}}
          // monthFormat={'yyyy'}
          // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
          theme={{
            calendarBackground: '#2A2E43',
            monthTextColor: '#F0CC3D',
            textSectionTitleColor: '#F0CC3D',
            dayTextColor: 'white',
            todayTextColor: '#F39C1D',
            selectedDayTextColor: 'white',
            selectedDayBackgroundColor: 'rgba(243,156,29,0.5)',
            // #F0CC3D
            textDisabledColor: 'gray',
            agendaKnobColor: '#F39C1D',
            'stylesheet.agenda.list': {
              container: {
                backgroundColor: '#2A2E43',
                flexDirection: 'row',
                alignSelf: 'stretch'
              },
              today: {
                color: '#F39C1D'
              }
            }
          }}
          //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
        />
        <Loader
          loading={this.state.loading}
          text="Chargement"
        />
      </View>
    );
  }
}
