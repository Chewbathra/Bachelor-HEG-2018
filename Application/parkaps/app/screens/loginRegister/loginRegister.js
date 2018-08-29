import React from "react";
import { View, Text, BackHandler, NetInfo, Alert, ToastAndroid, Switch, AsyncStorage } from "react-native";
import {inject} from 'mobx-react';
import {API} from '../../config/provider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

//Style
import { Header, Body, Title, Button, Form, Item, Icon, Input } from 'native-base';
import {logInUpStyle, globalStyles} from '../../style/index';

//Components
import {Loader} from "../../components/loader";


@inject('userStore')
export class LoginRegisterScreen extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    //Watching if user alreay connected
    this.state = {
      loginOpen: true,
      loading: false,
      errors: [],
      email: "",
      rememberMe: false
    };
    // this.userAlreadyConnected();
    //didFocus = when the screen focused
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );

    this.handleClick = this.handleClick.bind(this);
    this.loginWithEmail = this.loginWithEmail.bind(this);
    this.registerWithEmail = this.registerWithEmail.bind(this);

  }

  /**
   * Call when the component did mount and create event listener
   */
  componentDidMount() {
    //willBlur = when the screen will be unfocused
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  /**
   * Call when component unmount and remove event listener
   */
  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  /**
   * Verify if we have to go back on last screen
   * @return {boolean} Return true if we have to go back on last screen, else false
   */
  onBackButtonPressAndroid = () => {
    return true;
  }

  // async userAlreadyConnected(){
  //   const token = await AsyncStorage.getItem('token');
  //   const tokenType = await AsyncStorage.getItem('tokenType');
  //   if(token != null && tokenType != null){
  //     API.getUserInfos(token, tokenType)
  //       .then(res => {
  //         this.setState({
  //           loading: false
  //         })
  //         if(res.status === 200){
  //           this.props.userStore.setToken(token, tokenType);
  //           this.props.navigation.navigate("Map");
  //         } else {
  //           AsyncStorage.removeItem('token');
  //           AsyncStorage.removeItem('tokenType');
  //         }
  //       }).catch(error => {
  //       console.log(error);
  //       AsyncStorage.removeItem('token');
  //       AsyncStorage.removeItem('tokenType');
  //       this.setState({
  //         loading: false
  //       })
  //     });
  //   }
  //   this.setState({
  //     loading: false
  //   })
  // }

  /**
   * Change the current form displayed
   * @param form {string} which form display
   */
  setActiveForm(form){
    this.setState({
      loginOpen: form,
    });
  }

  /**
   * button click event
   */
  handleClick(){
    this.setState({
      loading: true
    }, () => {
      if(this.state.loginOpen){
        this.loginWithEmail();
      } else {
        this.registerWithEmail();
      }
    });
    //To get value of native base input : this._loginEmailRef._root._lastNativeText
  }

  /**
   * Log user into backend server and return a api token
   */
  async loginWithEmail(){
    const email = this.refs['loginEmail']._root._lastNativeText;
    const password = this.refs['loginPassword']._root._lastNativeText;
    API.loginWithEmail(email, password, this.state.rememberMe).then(response => {
      if(response.status == 200){
        // if(this.state.rememberMe){
        //   AsyncStorage.setItem('token',response.data.access_token);
        //   AsyncStorage.setItem('tokenType', response.data.token_type);
        // }
        this.props.userStore.setToken(response.data.access_token, response.data.token_type);
        this.refs['loginPassword']._root._lastNativeText = '';
        this.setState({
          loading: false,
          errors: []
        });
        ToastAndroid.show("Vous avez correctement été connecté", ToastAndroid.SHORT);
        this.props.navigation.navigate("Map");
      } else {
        this.setState({
          loading: false,
          errors: [{"other": "Pour une raison inconnue, la connexion à votre compte a échoué | " + JSON.stringify(response.data.errors)}]
        });
      }
    }).catch(error => {
      this.setState({
        loading: false,
        errors: error.data.errors || [{"other": "Erreur inconnue | " + JSON.stringify(error)}]
      });
      console.log(error);
    })

  }

  /**
   * Register user into backend server
   */
  async registerWithEmail(){
    const name = this.refs['registerName']._root._lastNativeText;
    const email = this.refs['registerEmail']._root._lastNativeText;
    const password = this.refs['registerPassword']._root._lastNativeText;
    const passwordConfirmation = this.refs['registerPasswordConfirmation']._root._lastNativeText;
    API.registerWithEmail(name, email, password, passwordConfirmation).then(response => {
      if(response.status === 201){
        ToastAndroid.showWithGravity(
          "Vous avez correctement été enregistré dans notre système. Veuillez valider votre compte grâce à l'email envoyé à " + email,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        this.setState({
          loading: false,
          loginOpen: true,
          errors: [],
          email: email
        }, () => {
          this.refs['loginEmail']._root._lastNativeText = email;
        })
      } else {
        this.setState({
          loading: false,
          errors: response.data.errors || [{"other": "Pour une raison inconnue, la création de votre compte a échoué | " + JSON.stringify(response)}]
        })
      }
    }).catch(error => {
      console.log(error);
      if(error.data.errors != null){
        this.setState({
          loading: false,
          errors: error.data.errors
        })
      } else {
        this.setState({
          loading: false,
          errors: [{"other": "Pour une raison inconnue, la création de votre compte a échoué | "}]
        })
      }
    })
  }

  render() {
    const {loginOpen, rememberMe, email, errors} = this.state;;
    const formLogin = <Form>
      <Item style={errors["email"] == null ? logInUpStyle.input : logInUpStyle.errorInput}>
        <Icon name='at' style={globalStyles.icon}/>
        <Input key={1} name="emailLogin" placeholder="Email" placeholderTextColor="#959DAD" ref="loginEmail" defaultValue={email} autoCapitalize={'none'} keyboardType={"email-address"}/>
      </Item>
      <Text style={logInUpStyle.inputError}>{errors["email"] == null ? '' : errors["email"]}</Text>
      <Item style={errors["password"] == null ? logInUpStyle.input : logInUpStyle.errorInput}>
        <Icon name='lock' style={globalStyles.icon}/>
        <Input key={2} name="passwordLogin" secureTextEntry={true} placeholder="Mot de passe" placeholderTextColor="#959DAD" ref="loginPassword"/>
      </Item>
      <Text style={logInUpStyle.inputError}>{errors["password"] == null ? '' : errors["password"]}</Text>
      <Item style={logInUpStyle.switch}>
        <Switch
          value={rememberMe}
          onValueChange={() => this.setState({rememberMe: !rememberMe})}
        />
        <Text style={logInUpStyle.switchText}>Se souvenir de moi</Text>
      </Item>
      <Text style={logInUpStyle.inputError}>{errors["active"] == null ? '' : errors["active"]}</Text>
      <Text style={logInUpStyle.inputError}>{errors["other"] == null ? '' : errors["other"]}</Text>
    </Form>;

    const formRegister = <Form >
      <Item style={errors["name"] == null ? logInUpStyle.input : logInUpStyle.errorInput}>
        <Icon name='person' style={globalStyles.icon}/>
        <Input key={3} name="nameRegister" placeholder="Nom" placeholderTextColor="#959DAD" ref="registerName"/>
      </Item>
      <Text style={logInUpStyle.inputError}>{errors["name"] == null ? '' : errors["name"]}</Text>
      <Item style={errors["email"] == null ? logInUpStyle.input : logInUpStyle.errorInput}>
        <Icon name='at' style={globalStyles.icon}/>
        <Input key={4} name="emailRegister" placeholder="Email" placeholderTextColor="#959DAD" ref="registerEmail" autoCapitalize={'none'} keyboardType={"email-address"}/>
      </Item>
      <Text style={logInUpStyle.inputError}>{errors["email"] == null ? '' : errors["email"]}</Text>
      <Item style={errors["password"] == null ? logInUpStyle.input : logInUpStyle.errorInput}>
        <Icon name='lock' style={globalStyles.icon}/>
        <Input placeholder="Mot de passe" secureTextEntry={true} placeholderTextColor="#959DAD" ref="registerPassword"/>
      </Item>
      <Text style={logInUpStyle.inputError}>{errors["password"] == null ? '' :errors["password"]}</Text>
      <Item style={errors["password"] == null ? logInUpStyle.input : logInUpStyle.errorInput}>
        <Icon name='lock' style={globalStyles.icon}/>
        <Input key={5} placeholder="Confirmer le mot de passe" secureTextEntry={true} placeholderTextColor="#959DAD" ref="registerPasswordConfirmation"/>
      </Item>
      <Text style={logInUpStyle.inputError}>{errors["other"] == null ? '' : errors["other"]}</Text>
    </Form>;

    return (
      <View style={logInUpStyle.container}>
        <Header style={globalStyles.header} androidStatusBarColor='#000000'>
          <Body>
            <Title>Connexion</Title>
          </Body>
        </Header>
        <View style={[globalStyles.segmentContainer, logInUpStyle.segment]}>
          <Button style={[globalStyles.segmentButton, this.state.loginOpen ? globalStyles.segmentSelected : globalStyles.segmentUnselected]}
            onPress={() => this.setActiveForm(true)}>
            <Text style={globalStyles.segmentText}>CONNEXION</Text>
          </Button>
          <Button style={[globalStyles.segmentButton, this.state.loginOpen ? globalStyles.segmentUnselected : globalStyles.segmentSelected]}
            onPress={() => this.setActiveForm(false)}>
            <Text style={globalStyles.segmentText}>ENREGISTREMENT</Text>
          </Button>
        </View>
        <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
          <Loader
            text="Chargement"
            loading={this.state.loading} />
          {loginOpen ? formLogin : formRegister}
          <Button style={logInUpStyle.sendButton}
            onPress={() => this.handleClick()}>
            <Text style={globalStyles.buttonText}>{loginOpen ? "SE CONNECTER" : "S'ENREGISTRER"}</Text>
          </Button>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
