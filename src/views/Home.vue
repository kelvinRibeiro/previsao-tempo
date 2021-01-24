<template>
  <div class="home " align="center">

    <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">

      <div class="row">

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 wg-bg">

          <div class="row justify-content-center mt-1 pb-3" >

            <h3 class="text-bold">TEMPO AGORA</h3>
          
          </div>

          <div class="row justify-content-center mt-1 mb-4" >

            <div class="">
              <vue-bootstrap-typeahead 
                v-model="city"
                placeholder="Informe uma Cidade" 
                :serializer="c => c.key"
                :data="searchData"
                
              />
            </div>

            <div class="">

              <button class="btn btn-primary btn-block " @click="getLocationData" >Buscar</button>
            </div>

          </div>
        </div>

        <div :class="`col-xs-12 col-sm-12 col-md-12 col-lg-12 ${ bg_class }`">

          <div class="row justify-content-center mt-4 current-weather" >
            
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-4">
              <h2 class="text-bold">{{ current.city }}</h2>
            </div>
            
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mb-4">
              
              <h4>{{ current.dt | weekday }}</h4>
              <h3>{{ current.weather ? current.weather[0].main : '' | weather }}</h3>
              <h1 class="text-bold">{{ current.temp | roundTemp }}</h1>

            </div>
          </div>
        </div>
      </div>
      
      <div class="row justify-content-center" >

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

          <div class="row day-weather">
            <table class="table table-sm ">

              <tbody>
                <tr
                  v-for="day in nexts" 
                  v-bind:key="day.dt"
                  class="text-bold text-uppercase"
                >
                  <td class="text-center">{{ day.dt | weekday }}</td>
                  <td>{{ day.weather ? day.weather[0].main : '' | weather }}</td>
                  <td>{{ day.temp.day | roundTemp }}</td>
                </tr>
              </tbody>

            </table>
          </div>

        </div>

      </div>

    </div>
    
  </div>
</template>

<script>

import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'

export default {
  name: 'Home',

  data () {
    return {
      city: '',
      action: '',
      searchData: [],
      bg_class: 'sun-bg'
    }
  },

  computed: {
    current () {
      return this.$store.state.geolocation.current
    },

    nexts () {
      return this.$store.state.geolocation.nexts
    },
  },

  methods: {

    getSearchData() {
      this.searchData = localStorage.getItem('search') ? JSON.parse(localStorage.getItem('search')) : []
    },

    requireLocation() {

      if(!navigator.geolocation) {
        
        console.log('Seu navegador não tem suporte a geolocalização')

      } else {
        
        navigator.geolocation.getCurrentPosition( position => { 

          const lat  = position.coords.latitude
          const lng = position.coords.longitude

          this.$store.dispatch(`geolocation/getWeather`,  { lat , lng } ).then((response) => {
          
            if(!response){
              console.log('Ocorreu um erro ao bucar as informações de clima')
              return
            }

            this.$store.dispatch(`geolocation/getCity`,  { lat , lng } ).then((city) => {
              
              if(!city){
                console.log('Ocorreu um erro ao bucar as informações da Cidade')
                return 
              }

              response.current.city = city

              if(!this.searchData.find(x => x.key === city)) {

                this.searchData.push({ key: city, coords:{ lat, lng } })
                localStorage.setItem('search', JSON.stringify(this.searchData))
              }
              
              this.getBgClass(response.current.weather[0].main)

              this.$store.commit(`geolocation/setState`, response)
            })
          })
        
        }, () => {
          console.log('Ocorreu um erro ao buscar a sua localização')
        })
      }

    },

    getLocationData() {
      
      let obj = ''
      
      if(!this.searchData.find(x => x.key === this.city)) {
        obj = this.city
        this.action = 'getCoords'

      } else {
        
        const data = this.searchData.find(x => x.key === this.city)
        
        obj = { lat: data.coords.lat , lng: data.coords.lng }
        this.action = 'getWeather'
      }

      this.$store.dispatch(`geolocation/${ this.action }`,  obj ).then((response) => {
       
        if(!response) {
          console.log('Ocorreu um erro ao bucar as informações')
          return
        }

        if(!this.searchData.find(x => x.key === this.city)) {

          this.searchData.push({ key: this.city, coords:{ lat: response.lat, lng: response.lon } })
          localStorage.setItem('search', JSON.stringify(this.searchData))
        }
        
        response.current.city =  this.city
        this.city = ''

         this.getBgClass(response.current.weather[0].main)
        
        this.$store.commit(`geolocation/setState`, response)
      })
    },

    getBgClass(value){
      
      if(value == 'Clear')
        this.bg_class = 'sun-bg'
      if(value == 'Mist')
        this.bg_class = 'Clouds-bg'
      else if(value == 'Rain')
        this.bg_class = 'rain-bg'
      else if(value == 'Clouds')
        this.bg_class = 'clouds-bg'
      else if(value == 'Snow')
        this.bg_class = 'snow-bg'
    }
  },  

  created() {

    this.requireLocation()

    this.getSearchData()
  },

  components: {
    VueBootstrapTypeahead
  }
}
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.wg-bg { 
  background-color: #1d4277;
  padding: 20px;
}

.sun-bg {
  background-image: url(./../assets/sol.jpg);
  background-repeat: no-repeat;
  background-position: center; 
}

.rain-bg {
  background-image: url(./../assets/chuva.jpg);
  background-repeat: no-repeat;
  background-position: bottom; 
}

.clouds-bg {
  background-image: url(./../assets/nublado.jpg);
  background-repeat: no-repeat;
  background-position: top; 
}

.snow-bg {
  background-image: url(./../assets/neve.jpg);
  background-repeat: no-repeat;
  background-position: bottom; 
}

.current-weather {
  font-weight: bold;
}

.day-weather {
  background-color: #1f5c8b;
}

.day-weather tr {
  font-size: 14px;
}

.text-bold {
  font-weight: bold;
}

.text-uppercase {
  text-transform: uppercase;
}

.form-control {
  border-radius: 0;
}
.btn {
  border-radius: 0;
}

</style>
