import React from 'react';
import {
  View,
  YellowBox,
  NativeModules,
  processColor,
  NetInfo,
  Alert
} from 'react-native';

import {Provider} from "mobx-react";
import stores from './mobx/stores/index';

import {Routes} from "./config/navigation/routes";
import {globalStyles} from './style/index'

import SplashScreen from 'react-native-splash-screen';

// YellowBox.ignoreWarnings([
//   "Warning: isMounted(...) is deprecated in plain JavaScript React classes. Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks.",
//   "Remote",
//   "VirtualizedList: missing keys for items"
// ]);

const {StatusBarManager } = NativeModules;

export default class App extends React.Component {

  componentDidMount() {
    StatusBarManager.setColor(processColor('#000000'),false)
    SplashScreen.hide();

    // NetInfo.getConnectionInfo().then((connectionInfo) => {
    //   console.log(connectionInfo);
    //   if(connectionInfo.type === 'none'){
    //     Alert.alert(
    //       'Connexion internet',
    //       "Veuillez vous reconnecter à internet. Sans connexion internet, aucune fonctionnalité de l'application ne fonctionnera"
    //     )
    //   } else if(connectionInfo.type === 'unknown'){
    //     Alert.alert(
    //       'Connexion internet',
    //       "Il est possible que votre connexion internet ne fonctionne pas. Sans connexion internet, aucune fonctionnalité de l'application ne fonctionnera"
    //     )
    //   }
    // });

    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  componentWillUnmount(){
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange(connectionInfo) {
    if(connectionInfo.type === 'none'){
      Alert.alert(
        'Connexion internet',
        "Veuillez vous reconnecter à internet. Sans connexion internet, aucune fonctionnalité de l'application ne fonctionnera"
      )
    } else if(connectionInfo.type === 'unknown'){
      Alert.alert(
        'Connexion internet',
        "Il est possible que votre connexion internet ne fonctionne pas. Sans connexion internet, aucune fonctionnalité de l'application ne fonctionnera"
      )
    }
  }



  render() {
    return (
      <View style={{flex: 1}}>
        <Provider {...stores}>
          <Routes />
        </Provider>
      </View>
    );
  }
}
