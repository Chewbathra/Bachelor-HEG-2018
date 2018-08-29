import axios from 'axios';


const client = axios.create({
  baseURL: 'http://parkaps.chalet-schupbach.ch/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
  }
});

// const client = axios.create({
//   baseURL: 'http://192.168.1.127:8000/api',
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json',
//     'X-Requested-With': 'XMLHttpRequest',
//     'Accept': 'application/json'
//   }
// });

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
   * @param description
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
   * Modify a car park
   * @param id
   * @param latitude
   * @param longitude
   * @param address
   * @param picture
   * @param price
   * @param description
   * @param token
   * @param tokenType
   * @return {Promise<Promise<any> | Promise>}
   */
  static async modifyCarPark(id, latitude, longitude, address, picture, price, description, token, tokenType){
    return new Promise((resolve, reject) => {
      const carPark = {
        latitude: latitude,
        longitude: longitude,
        address: address,
        picture: picture,
        price: price,
        description: description
      };
      client.put('carparks/' + id, JSON.stringify(carPark), {
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
   * Delete a car park
   * @param id
   * @param token
   * @param tokenType
   * @return {Promise<Promise<any> | Promise>}
   */
  static async deleteCarPark(id, token, tokenType){
    return new Promise((resolve, reject) => {
      client.delete('carparks/' + id,{
        headers: {
          'Authorization': tokenType + ' ' + token
        }
      })
        .then(response => {
          console.log(response);
          resolve(response);
        }).catch(error => {
          console.log(error);
        reject(error.response);
      })
    })
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

  /**
   * Return all car parks of the connected user
   * @param token
   * @param tokenType
   * @return {Promise<Promise<any> | Promise>}
   */
  static async getUserCarParks(token, tokenType){
    return new Promise((resolve, reject) => {
      client.get('user/carparks',{
        headers: {
          'Authorization': tokenType + ' ' + token
        }
      }).then(response => {
        resolve(response);
      }).catch(error => {
        console.log(error);
        reject(error.response);
      })
    })
  }

  /**
   * Return all occupants of the connected user
   * @param token
   * @param tokenType
   * @return {Promise<any> | Promise}
   */
  static getUserOccupants(token, tokenType){
    return new Promise((resolve, reject) => {
      client.get('user/occupants',{
        headers: {
          'Authorization': tokenType + ' ' + token
        }
      }).then(response => {
        resolve(response);
      }).catch(error => {
        console.log(error);
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

  /**
   * Return all occupants for a car park
   * @param id - Car Park id
   * @param token
   * @param tokenType
   * @return {Promise<Promise<any> | Promise>}
   */
  static  async getOccupantsForCarPark(id, token, tokenType){
    return new Promise((resolve, reject) => {
      client.get('carparks/' + id + '/occupants', {
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
   * Create a new occupant
   * @param start
   * @param end
   * @param carParkId
   * @param token
   * @param tokenType
   * @return {Promise<Promise<any> | Promise>}
   */
  static async createOccupant(start, end, carParkId, token, tokenType){
    return new Promise((resolve, reject) => {
      const occupant = {
        start: start.getTime(),
        end: end.getTime(),
        carParkId: carParkId
      };
      client.post('occupants', JSON.stringify(occupant),{
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
   * Delete the selected occupant
   * @param id
   * @param token
   * @param tokenType
   * @return {Promise<any> | Promise}
   */
  static async deleteOccupant(id, token, tokenType){
    return new Promise((resolve, reject) => {
      client.delete('occupants/' + id, {
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
   * Delete the connected user
   * @param token
   * @param tokenType
   * @return {Promise<any> | Promise}
   */
  static async deleteUser(token, tokenType){
    return new Promise((resolve, reject) => {
      client.delete('user', {
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

  static async modifyUser(user, token, tokenType){
    return new Promise((resolve, reject) => {
      const userToModify = {
        name: user.name,
        email: user.email
      }
      client.put('user', JSON.stringify(userToModify), {
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