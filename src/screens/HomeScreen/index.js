import React, {Component} from 'react';
import {
    StyleSheet,
    StatusBar,
    AsyncStorage
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Weather from './weather';
import {LinearGradient} from 'expo-linear-gradient';
import { firestore } from '../../firebase/firebase';
import {weatherCases} from './weatherCases';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

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

      registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          const token = await Notifications.getExpoPushTokenAsync();
        
          console.log(token);
          firestore.collection('users').doc(this.user).set({value: token});

          this.setState({ expoPushToken: token });
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.createChannelAndroidAsync('default', {
            name: 'default',
            sound: true,
            priority: 'max',
            vibrate: [0, 250, 250, 250],
          });
        }
        
      };
    
      async componentDidMount() {
        const user = await AsyncStorage.getItem('user');
        if(user != null) {
          this.user = user;
  
          await this.registerForPushNotificationsAsync();
  
          this.weatherCases = weatherCases;
          firestore.collection('weatherCases').get()
          .then(docs => {
            docs.forEach(doc => {
              this.weatherCases[doc.id] = doc.data();
            })
          });
        }
        

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
