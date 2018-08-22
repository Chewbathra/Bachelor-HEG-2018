import axios from 'axios';


// const client = axios.create({
//   baseURL: 'http://parkaps.chalet-schupbach.ch/api',
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json',
//     'X-Requested-With': 'XMLHttpRequest',
//     'Accept': 'application/json'
//   }
// });

const client = axios.create({
  baseURL: 'http://192.168.1.127:8000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
  }
});

export class API {

  /**
   * Register new user to the backend server
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @param {string} password_confirmation
   * @return {Promise<Promise<any> | Promise>} - Return the server response
   */
  static async registerWithEmail(name, email, password, password_confirmation){
    return new Promise((resolve, reject) => {
      const user = {
        name: name,
        email: email,
        password: password,
        password_confirmation: password_confirmation
      };
      client.post('users',JSON.stringify(user))
      .then(response => {
        resolve(response);
      }).catch(error => {
        reject(error.response);
      })
    })
  }

  /**
   * Login user with email and password
   * @param {string} email
   * @param {string} password
   * @param {string} rememberMe
   * @return {Promise<Promise<any> | Promise>} - Return the server response
   */
  static async loginWithEmail(email, password, rememberMe) {
    return new Promise((resolve, reject) => {
      const user = {
        email: email,
        password: password,
        remember_me: rememberMe
      };
      client.post('login',JSON.stringify(user))
      .then(response => {
        resolve(response);
      }).catch(error => {
        reject(error.response);
      })
    })
  }

  /**
   * Logout user associated to this token
   * @param {string} token
   * @param {string} tokenType
   * @return {Promise<Promise<any> | Promise>}
   */
  static async logoutUser(token, tokenType){
    return new Promise((resolve, reject) => {
      client.get('logout',{
        headers: {
          'Authorization': tokenType + ' ' + token
        }
      })
        .then(response => {
          resolve(response);
        }).catch(error => {
        reject(error.response);
      })
    })
  }

  /**
   * Create a new car park
   * @param {string} latitude
   * @param {string} longitude
   * @param {string} address
   * @param {string} picture
   * @param {number} price
   * @param {string} token
   * @param {string} tokenType
   * @return {Promise<Promise<any> | Promise>} - Return the server response
   */
  static async createCarPark(latitude, longitude, address, picture, price, description, token, tokenType){
    return new Promise((resolve, reject) => {
      const carPark = {
        latitude: latitude,
        longitude: longitude,
        address: address,
        picture: picture,
        price: price,
        description: description
      };
      console.log(carPark);
      client.post('carparks', JSON.stringify(carPark), {
        headers: {
          'Authorization': tokenType + ' ' + token
        }
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error.response);
      })
    });
  }

  /**
   * Return all car parks in the specified radius
   * @param {string} latitude
   * @param {string} longitude
   * @param {number} radius
   * @param {string} token
   * @param {string} tokenType
   * @return {Promise<Promise<any> | Promise>} - Return the server response
*/
  static async searchCarPark(latitude, longitude, radius, token, tokenType){
    return new Promise((resolve, reject) => {
      const search = {
        latitude: latitude,
        longitude: longitude,
        radius: radius
      };
      console.log(search, token, tokenType);
      client.post('carparks/search',JSON.stringify(search),{
        headers: {
          'Authorization': tokenType + ' ' + token
        }
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error.response);
      })
    })
  }

  /**
   * Return connected user informations
   * @param {string} token
   * @param {string} tokenType
   * @return {Promise<Promise<any> | Promise>}  - Return the server response
   */
  static async getUserInfos(token, tokenType){
    return new Promise((resolve, reject) => {
      client.get('user',{
        headers: {
          'Authorization': tokenType + ' ' + token
        }
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error.response);
      })
    })
  }

  static async getUserCarParks(token, tokenType){
    return new Promise((resolve, reject) => {
      client.get('user/carparks',{
        headers: {
          'Authorization': tokenType + ' ' + token
        }
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error.response);
      })
    })
  }

  /**
   * Create a new availability
   * @param {Date} start
   * @param {Date} end
   * @param {boolean} [daily=false]
   * @param {number} carParkId
   * @param {string} token
   * @param {string} tokenType
   * @return {Promise<Promise<any> | Promise>} - Return the server response
   */
  static async createAvailability(start, end, daily, carParkId, token, tokenType){
    return new Promise((resolve, reject) => {
      const availability = {
        start: start.getTime(),
        end: end.getTime(),
        daily: daily,
        carParkId: carParkId
      };
      console.log(availability);
      client.post('availabilities', JSON.stringify(availability), {
        headers: {
          'Authorization': tokenType + ' ' + token
        }
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error.response);
      })
    })
  }

  /**
   * Return all availabilites fro a specific car park id
   * @param {number} carParkId
   * @param {string} token
   * @param {string} tokenType
   * @return {Promise<Promise<any> | Promise>} - Return the server response
   */
  static async searchavailabilities(carParkId, token, tokenType){
    return new Promise((resolve, reject) => {
      client.get('carparks/' + carParkId + '/availabilities',{
        headers: {
          'Authorization': tokenType + ' ' + token
        }
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error.response);
      })
    });
  }

  /**
   * Delete an availability
   * @param {Availability} availability
   * @param {string} token
   * @param {string} tokenType
   * @return {Promise<Promise<any> | Promise>} - Return the server response
   */
  static async deleteAvailability(id, daily,  token, tokenType){
    return new Promise((resolve, reject) => {
      const objectToDelete = {
        daily: daily
      };
      client.post('availabilities/' + id, JSON.stringify(objectToDelete),{
        headers: {
          'Authorization': tokenType + ' ' + token
        }
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error.response);
      })
    });
  }
}