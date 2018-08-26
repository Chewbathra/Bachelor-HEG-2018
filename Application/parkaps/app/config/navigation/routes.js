import React from 'react';
import {createBottomTabNavigator, createStackNavigator} from 'react-navigation';

import {Icon} from 'native-base';

import * as Screens from '../../screens';



const Tabs = createBottomTabNavigator(
  {
    Map: {
      screen: Screens.MapScreen,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <Icon name="map" size={35} style={{color: tintColor}} />
        )
      })
    },
    Profile: {
      screen: Screens.ProfileScreen,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <Icon name="person" size={35} style={{color: tintColor}} />
        )
      })
    }
  },
  {
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      activeTintColor: '#F39C1D',
      inactiveTintColor: '#FFFFFF',
      style: {
        backgroundColor: '#000000',
        height: 60,
        paddingVertical: 5,
      },
      labelStyle: {
        fontSize: 12,
        lineHeight: 20
      }
    },
  }
)

export const Routes = createStackNavigator({
    Home: {
      screen: Screens.HomeScreen,
    },
    Login: {
      screen: Screens.LoginRegisterScreen
    },
    AddPlace: {
      screen: Screens.AddPlaceScreen,
    },
    AddSchedule: {
      screen: Screens.AddScheduleScreen
    },
    MapModal: {
      screen: Screens.MapModalScreen
    },
    AddOccupant: {
      screen: Screens.AddOccupantScreen
    },
    Parameters: {
      screen: Screens.ParametersScreen
    },
    Tab: {
      screen: Tabs
    }
  },
  {
    tabBarOptions: {
      initialRouteName: 'Home',
    },
    headerMode: 'none',
    navigationOptions: {
      disableBack: true,
      gesturesEnabled: false,
      headerVisible: false
    }
  }
)


