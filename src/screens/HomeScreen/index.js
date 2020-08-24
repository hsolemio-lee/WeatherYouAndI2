import React, {Component} from 'react';
import {
    StyleSheet,
    StatusBar
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Weather from './weather';
import {LinearGradient} from 'expo-linear-gradient';
import { firestore } from '../../firebase/firebase';
import {weatherCases} from './weatherCases';

const API_KEY = '0c429a365bfdc6a7526ee98e9324781f';

export default class HomeScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
          isLoaded: false,
          error: null,
          temperature: null,
          name: "What",
          position: null,
          screenNo: 0,
          swipe: ""
        }
      
        this._getWeather = this._getWeather.bind(this);
        this._getCurrentLocAndWeather = this._getCurrentLocAndWeather.bind(this);
        this._refreshWeather = this._refreshWeather.bind(this);
        
        
      }
    
      componentDidMount() {
        this.weatherCases = weatherCases;
        firestore.collection('weatherCases').get()
        .then(docs => {
          docs.forEach(doc => {
            this.weatherCases[doc.id] = doc.data();
          })
        });

        navigator.geolocation.getCurrentPosition(
          position => {
            this._getWeather(position);
            this.setState({
              isLoaded: true,
              position: position
            });
          },
          error => {
            console.log(error);
            this.setState({
              error : error
            });
          }
        );
  
      }
    
      _getWeather = (position) => {
        const url = "http://api.openweathermap.org/data/2.5/weather?units=metric&lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&APPID="+API_KEY
        
        fetch(url)
        .then(res => res.json())
        .then(json => {
          this.setState({
            temperature : json.main.temp,
            name: json.weather[0].main,
            isLoaded: true,
            position: position,
          });
        })
      }
    
      _getCurrentLocAndWeather() {
        navigator.geolocation.getCurrentPosition(
          position => {
            // console.log("position: ",position);
            this._getWeather(position);
          },
          error => {
            console.log(error);
            this.setState({
              error : error
            });
          }
        )
      }
    
      _refreshWeather() {
        this.setState({
          isLoaded: false
        })
        this._getCurrentLocAndWeather();
      }
 

    render(){
        const {isLoaded, temperature, name} = this.state;
        const resultWeatherCases = this.weatherCases ? this.weatherCases : weatherCases;
        return (
            <LinearGradient
                      colors = {resultWeatherCases[name].colors}
                      style = {styles.container}> 
                <Weather temp = {Math.floor(temperature)} 
                    weatherCase = {resultWeatherCases[name]}
                    pressWeather={this._refreshWeather} 
                    isLoaded={isLoaded}/>
                <StatusBar barStyle="light-content"/>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
        backgroundColor: 'white',
    },
    wrapContent: {
        width: wp('90%'),
        height: wp('90%'),
        paddingBottom: wp('5%'),
        
    },
    content: {
        width: "100%",
        height: "100%",
        backgroundColor: "#46c3ad",
    }
})
