import React from "react";
import {View, ToastAndroid, DatePickerAndroid, TimePickerAndroid, Alert, Modal} from "react-native";
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
      dailyOpen: false,
      errors: [],
      carPark: props.navigation.getParam('carPark', {
        address: 'ID test: 1',
        id: 1
      }),

      items: {},
      markedDates: {},
      dates: [],

      scheduleSelectorVisible: false,

      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null
    };

    this.saveDatesToItems = this.saveDatesToItems.bind(this);
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
    this.fetchAvailabilities();
  }

  /**
   * Fetch all availabilites for the current car park id
   */
  fetchAvailabilities(){
    this.setState({
      loading: true
    }, () => {
      API.searchavailabilities(this.state.carPark.id, this.props.userStore.token, this.props.userStore.tokenType)
        .then(async response => {
          console.log(response);
          if(response.status == 200){
            const availabilites = response.data.availabilities;
            const dailyAvailabilities = response.data.daily_availabilities;
            await this.asyncForEach(availabilites, async (availability) => {
              const start = new Date(availability.start);
              const end = new Date(availability.end);
              const dates = this.getDatesBetween(start, end);
              let stateDates = this.state.dates;
              stateDates.push({start: start, end: end});
              await this.saveDatesToItems(dates, start, end, availability.id)
            })
            this.setState({
              loading: false
            })
          } else {

          }
        }).catch(error => {
        console.log(error);
        this.setState({
          loading: false
        })
      })
    })
  }

  /**
   * Go back to profile page and reload car park list
   */
  goToProfile(){
    this.props.navigation.navigate("Profile");
    this.props.navigation.getParam('update')();
  }

  /**
   * Change the active segment
   */
  changeSegment(){
    this.setState({
      dailyOpen: !this.state.dailyOpen,
      loading: true,
    }, () => this.setState({loading: false}));
  }

  /**
   * Display the schedule selector
   */
  onScheduleAdd(){
    this.setState({
      scheduleSelectorVisible: true
    })
  }

  /**
   * Save a new schedule to the database and display him in the screen
   */
  saveSchedule(){
    if(this.state.dailyOpen){

    } else {
      if (this.state.startDate > this.state.endDate) {
        Alert.alert(
          'Erreur',
          "Les dates que vous avez inscrites ne sont pas correctes. La date de fin doit être après la date de début"
        )
      } else if (this.state.startTime >= this.state.endTime && this.state.startDate.toString() === this.state.endDate.toString()) {
        Alert.alert(
          'Erreur',
          "Les heures que vous avez inscrites ne sont pas correctes. L'heure de fin doit être après l'heure de début"
        )
      } else {
        this.setState({
          scheduleSelectorVisible: false,
          loading: true
        }, () => {
          let start = this.state.startDate;
          let end = this.state.endDate;
          start.setHours(this.state.startTime.getHours());
          start.setMinutes(this.state.startTime.getMinutes());
          end.setHours(this.state.endTime.getHours());
          end.setMinutes(this.state.endTime.getMinutes());
          let error = false;
          this.state.dates.forEach(date => {
            if(start >= date.start && end <= date.end){
              error = true;
            }
            if(start < date.start && end >= date.start){
              error = true
            }
            if(end > date.end && start <= date.end){
              error = true;
            }
          });

          if(error){
            Alert.alert(
              'Erreur',
              "L'horaire que vous essayez de créer est compris dans un horaire déjà existant."
            )
            this.setState({
              loading: false,
            })
          } else {
            API.createAvailability(start, end, this.state.dailyOpen,this.state.carPark.id, this.props.userStore.token, this.props.userStore.tokenType).then(response => {
              console.log(response);
              if(response.status === 201) {
                const dates = this.getDatesBetween(start, end);
                let stateDates = this.state.dates;
                stateDates.push({start: start, end: end});
                this.saveDatesToItems(dates, start, end, response.data.availability.id).then( () =>{
                    this.setState({
                      loading: false,
                      startDate: null,
                      endDate: null,
                      startTime: null,
                      endTime: null,
                      dates: stateDates
                    });
                  ToastAndroid.show('Votre horaire a correctement été enregistré', ToastAndroid.SHORT);
                })
              } else {
                Alert.alert(
                  'Erreur',
                  "Votre horaire n'a pas pu être correctement enregistré"
                )
              }
            }).catch(error => {
              console.log(error);
              this.setState({
                loading: false
              });
              Alert.alert(
                'Erreur',
                "Erreur inconnue |" + JSON.stringify(error)
              )
            })
          }
        })
      }
    }
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
   * Create random hsla color
   * @return {string} - The random color
   */
  randomHsl() {
    return 'hsla(' + (Math.random() * 360) + ', 50%, 70%, 0.8)';
  }

  /**
   * Save all dates to items for calendar and create markedDates for displaying
   * @param {Array} dates - Dates to save
   * @param {Date} start - Starting date
   * @param {Date} end - End date
   * @param {boolean} daily - Is this daily
   * @param {number} availabilityId - Id of this availability
   * @return {Promise<any> | Promise}
   */
  saveDatesToItems(dates, start, end, availabilityId = 0){
    return new Promise((resolve) => {
      let name = "Du " + start.toLocaleString() + " au " + end.toLocaleString();
      let newItems = this.state.items;
      let newMarkedDates = this.state.markedDates;
      let item = {
        name: name,
        id: availabilityId,
        backgroundColor: this.randomHsl()
      };
      dates.forEach(date => {
        if(newItems[date] !=  null) {
          newItems[date].push(item);
        } else {
          newItems[date] = [item]
        }
      });
      console.log(start.toDateString(), end.toDateString());
      console.log(newMarkedDates[start.toISOString().split('T')[0]] == null);
      if(start.toDateString() === end.toDateString() && newMarkedDates[start.toISOString().split('T')[0]] == null){
        console.log('egal');
          newMarkedDates[start.toISOString().split('T')[0]] = {color: '#c97852', startingDay: true, endingDay: true}
      } else if(start.toDateString() !== end.toDateString()) {
        console.log('non egal');
        if (newMarkedDates[start.toISOString().split('T')[0]] == null) {
          newMarkedDates[start.toISOString().split('T')[0]] = {color: '#c97852', startingDay: true}
        } else {
          newMarkedDates[start.toISOString().split('T')[0]] = {color: '#c97852'}
        }
        if (newMarkedDates[end.toISOString().split('T')[0]] == null) {
          newMarkedDates[end.toISOString().split('T')[0]] = {color: '#c97852', endingDay: true}
        } else {
          newMarkedDates[end.toISOString().split('T')[0]] = {color: '#c97852'}
        }
        for(let i = 1; i < dates.length - 1; i++){
          const d = dates[i];
          newMarkedDates[d] = {color: '#c97852'}
        }
      }
      this.setState({
        items: newItems,
        markedDates: newMarkedDates
      }, () => resolve(true));
    })
  }

  /**
   * Delete the selected availability
   * @param availability
   */
  deleteAvailability(availability){
    API.deleteAvailability(availability.id, this.state.dailyOpen, this.props.userStore.token, this.props.userStore.tokenType)
      .then(response => {
        console.log(response);
        // let items = this.state.items;
        // const itemKeys = Object.keys(items);
        // itemKeys.forEach(key => {
        //  for(let i = items[key].length - 1; i >= 0; i--){
        //    if(items[key][i].id === availability.id){
        //      items[key].splice(i,1);
        //    }
        //  }
        // });
        //
        // let dailyItems = this.state.dailyItems;
        // for(let i = dailyItems.length - 1; i >= 0; i--){
        //   if(dailyItems[i].id === availability.id){
        //     dailyItems.splice(i,1);
        //   }
        // }
        // this.setState({
        //   items: items,
        //   dailyItems: dailyItems
        // }, () => {
        //   ToastAndroid.showWithGravity(
        //     'Horaire supprimé correctement',
        //     ToastAndroid.SHORT,
        //     ToastAndroid.CENTER
        //   );
        // });
      }).catch((error) => {
        console.log(error);
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

  renderItem(item) {
    return (
      <View style={[addScheduleStyles.item, {backgroundColor: item.backgroundColor}]}>
        <Text style={addScheduleStyles.itemText}>{item.name}</Text>
        <Button bordered danger rounded style={addScheduleStyles.itemButton}
          onPress={() => this.deleteAvailability(item)}>
          <Icon name="trash" style={{color: 'red'}}/>
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
    const dailyAgenda = null;
    const agenda =
      <Agenda
        style={addScheduleStyles.calendar}
        firstDay={1}
        minDate={new Date()}
        pastScrollRange={1}
        futureScrollRange={6}
        items={this.state.items}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        renderEmptyData = {this.renderEmptyData.bind(this)}
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
          },
          'stylesheet.agenda.main': {
            reservations: {
              flex: 1,
              marginTop: 104,
              backgroundColor: '#2A2E43'
            }
          }
        }}
      />

    const dailyForm = null;
    const form =
      <Form >
        <Item style={addScheduleStyles.input}>
          <Icon name='clock' style={globalStyles.icon}/>
          <Input placeholder="Date de début" placeholderTextColor="#959DAD" ref="start" editable={false}
                 value={this.state.startDate == null ? '' : this.state.startDate.toLocaleDateString()}/>
          <Button warning style={addScheduleStyles.inputButton}
            onPress={() => this.setStartDate()}>
            <Icon name='create' />
          </Button>
        </Item>
        <Item style={addScheduleStyles.input}>
          <Icon name='clock' style={globalStyles.icon}/>
          <Input placeholder="Heure de début" placeholderTextColor="#959DAD" ref="start" editable={false}
                 value={this.state.startTime == null ? '' : this.state.startTime.getHours() + ':' + this.state.startTime.getMinutes()}/>
          <Button warning style={addScheduleStyles.inputButton}
                  onPress={() => this.setStartTime()}>
            <Icon name='create' />
          </Button>
        </Item>
        <Item style={addScheduleStyles.input}>
          <Icon name='clock' style={globalStyles.icon}/>
          <Input placeholder="Date de fin" placeholderTextColor="#959DAD" ref="end" editable={false}
                 value={this.state.endDate == null ? '' : this.state.endDate.toLocaleDateString()}/>
          <Button warning style={addScheduleStyles.inputButton}
              onPress={() => this.setEndDate()}>
            <Icon name='create' />
          </Button>
        </Item>
        <Item style={addScheduleStyles.input}>
          <Icon name='clock' style={globalStyles.icon}/>
          <Input placeholder="Heure de fin" placeholderTextColor="#959DAD" ref="start" editable={false}
                 value={this.state.endTime == null ? '' : this.state.endTime.getHours() + ':' + this.state.endTime.getMinutes()}/>
          <Button warning style={addScheduleStyles.inputButton}
                  onPress={() => this.setEndTime()}>
            <Icon name='create' />
          </Button>
        </Item>
      </Form>;


    return (
      <View style={addScheduleStyles.container}>
        <Loader
          text="Chargement"
          loading={this.state.loading} />

        <Header style={globalStyles.header} androidStatusBarColor='#000000'>
          <Left>
            <Button transparent
                onPress={() => this.goToProfile()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
            <Title>Horaires</Title>
          </Body>
        </Header>

        <Text style={[globalStyles.buttonText, addScheduleStyles.addressText]}>{this.state.carPark.address}</Text>
        <View style={[globalStyles.segmentContainer, profileStyles.segment]}>
          <Button style={[globalStyles.segmentButton, this.state.dailyOpen ? globalStyles.segmentUnselected : globalStyles.segmentSelected]}
                  onPress={() => this.changeSegment()}>
            <Text style={globalStyles.segmentText}>NORMAUX</Text>
          </Button>
          <Button style={[globalStyles.segmentButton, this.state.dailyOpen ? globalStyles.segmentSelected : globalStyles.segmentUnselected]}
                  onPress={() => this.changeSegment()}>
            <Text style={globalStyles.segmentText}>JOURNALIERS</Text>
          </Button>
        </View>
        {this.state.dailyOpen ? dailyAgenda : agenda}

        <Button bordered rounded style={addScheduleStyles.addScheduleButton}
          onPress={() => this.onScheduleAdd()}>
          <Text style={addScheduleStyles.addScheduleButtonText}>Ajouter un horaire</Text>
        </Button>

        <Modal
          transparent={true}
          animationType={'fade'}
          onRequestClose={() => {}}
          visible={!!this.state.scheduleSelectorVisible}>
          <View style={addScheduleStyles.modalBackground}>
            <View style={addScheduleStyles.modalContainer}>
              <Text style={addScheduleStyles.modalTitle}>Création d'un horaire {this.state.dailyOpen ? 'journalier' : 'normal'}</Text>
              {form}
              <Button
                onPress={() => this.saveSchedule()}
                style={addScheduleStyles.sendButton}>
                <Text>Enregistrer</Text>
              </Button>
              <Button
                onPress={() => this.setState({scheduleSelectorVisible: false, startDate: null, endDate: null, startTime: null, endTime: null})}
                style={addScheduleStyles.sendButton}>
                <Text>Annuler</Text>
              </Button>
            </View>
          </View>
        </Modal>


      </View>
    );
  }
}
