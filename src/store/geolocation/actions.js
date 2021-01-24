'use strict'

import Vue from 'vue'

export const getCoords = (context, data) => {

  return new Promise((resolve, reject) => {
    
    Vue.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${ data }&key=AIzaSyAAuyEYLNwFpfo0WPZ9c9zqTkFxJtss4i4`)
      .then(response => {

        if(response.data.status === 'OK'){
         
          let data = {
            city: response.data.results[0].address_components[0].long_name,
            lat:  response.data.results[0].geometry.location.lat,
            lng: response.data.results[0].geometry.location.lng
          }
          
          getWeather(context, data).then( r => {
            resolve(r)
          }, err => reject(err) )
        }
        
    }, err => reject(err) )

  })
}


export const getCity = (context, data) => {

  return new Promise((resolve, reject) => {
    
    Vue.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${ data.lat },${ data.lng }&key=AIzaSyAAuyEYLNwFpfo0WPZ9c9zqTkFxJtss4i4`)
      .then(response => {

        if(response.data.status === 'OK'){
          resolve(response.data.results[0].address_components[3].long_name)
        }
        
    }, err => reject(err) )

  })
}

export const getWeather = (context, data) => {
 
  return new Promise((resolve, reject) => {

    Vue.http.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${ data.lat }&lon=${ data.lng }&exclude=hourly,minutely&units=metric&lang=pt_br&appid=c6ed8759431373a3ed2fdd02f2d0ed6e`)
      .then( response => {
        response.data.city = data.city
        resolve(response.data)
    }, err => reject(err) )

  })
}





