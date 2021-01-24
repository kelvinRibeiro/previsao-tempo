import Vue from 'vue'
import moment from 'moment'
moment.locale('pt-br');

Vue.filter('capitalize', (value) => {
  if(!value)
  return ''

  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('weather', (value) => {
  
  if(value == 'Clear')
   value = 'Sol'
  else if(value == 'Rain')
   value = 'Chuva'
  else if(value == 'Mist')
   value = 'Névoa'
  else if(value == 'Clouds')
   value = 'Nublado'
  else if(value == 'Snow')
   value = 'Neve'
  else
    value = ''

  return value
})

Vue.filter('formatWeather', (value) => {
  if(!value)
  return ''
  value = value.split(' ')[0]
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('roundTemp', (value) => {
  if(!value)
  return ''

  return `${ Number(Math.round(value))} Cº`
})

Vue.filter('date', (value) => {
  return moment(value).format('DD/MM/YYYY')
})

Vue.filter('weekday', (value) => {
  if(!value)
  return ''

  value = moment.unix(value).format('dddd')
  return value.charAt(0).toUpperCase() + value.slice(1)
})