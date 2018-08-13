import {observable, action} from 'mobx';

export default class UserStore {
  @observable email = 'test';
  @observable token = '';
  @observable tokenType = '';

  @action setEmail(email) {
    this.email = email;
  }

  @action setToken(token, tokenType){
    this.token = token;
    this.tokenType = tokenType;
  }
}