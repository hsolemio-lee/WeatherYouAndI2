import React, {Component} from 'react';
import {StyleSheet, Text, View, Animated, ActivityIndicator} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import PropTypes from "prop-types";

export default class Weather extends Component {
    constructor(props) {
      super(props);
      this.state={
        titleValue: new Animated.Value(0),
        subTitleValue: new Animated.Value(0),
      };

      this._fadeIn = this._fadeIn.bind(this);
      this._fadeOut = this._fadeOut.bind(this);
      this._getTitleStyle = this._getTitleStyle.bind(this);
      this._getSubTitleStyle = this._getSubTitleStyle.bind(this);
      this._pressWeather = this._pressWeather.bind(this);
      this._returnIcon = this._returnIcon.bind(this);
    }

    componentDidMount() {
      this.props.pressWeather();
      this._fadeIn();
    }

    _fadeIn(){
      Animated.parallel([
          Animated.timing(this.state.titleValue, {
            toValue : 1,
            duration : 300,
            //easing : Easing.bounce,
            delay : 200,
            useNativeDriver: true,
          }),
          Animated.timing (this.state.subTitleValue, {
            toValue : 1,
            duration : 300,
            //easing : Easing.bounce,
            delay : 300,
            useNativeDriver: true,
          })
      ]).start();
    }

    _fadeOut(){
      Animated.parallel([
        Animated.timing(this.state.titleValue, {
          toValue : 0,
          duration : 300,
          //easing : Easing.bounce,
          delay : 0,
          useNativeDriver: true,
        }),
        Animated.timing (this.state.subTitleValue, {
          toValue : 0,
          duration : 300,
          //easing : Easing.bounce,
          delay : 300,
          useNativeDriver: true,
        })
      ]).start(()=>{
        this.props.pressWeather();
        this._fadeIn();
      });
    }

    _getTitleStyle() {
      const title = {
          fontSize: 38,
          color: "white",
          marginBottom: 10,
          fontWeight: "300",
          opacity: this.state.titleValue
      }
      return title;  
    }

    _getSubTitleStyle() {
      const subTitle = {
        fontSize: 24,
        color: "white",
        marginBottom: 100,
        opacity: this.state.subTitleValue
      }
      return subTitle;
    }

    _pressWeather() {
      this._fadeOut();
    }

    _returnIcon() {
      const {weatherCase, weatherName} = this.props;
      if(weatherName == "Haze" || weatherName == "Mist") {
        return <MaterialCommunityIcons 
                color="white" 
                size={144} 
                name={weatherCase.icon} 
          onPress={this._pressWeather}/>;
      } else if (weatherName == "Drizzle") {
        return <Feather 
                color="white" 
                size={144} 
                name={weatherCase.icon}
                onPress={this._pressWeather}/>;
      } else {
        return <Ionicons 
                color="white" 
                size={144} 
                name={weatherCase.icon}
                onPress={this._pressWeather}/>;
      }
    
    }

    render() {
      const {temp, weatherCase, isLoaded} = this.props;
      const subtitleIndex = Math.floor(Math.random()*(weatherCase.subtitle.length));
      
          
        return (
            <View style = {styles.container}>        
                <ActivityIndicator animating={!isLoaded} style={styles.loadingBar} size="large" color="white"/>    
                <View style={styles.upper} >
                    {this._returnIcon()}
                    <Text style={styles.temp}>{temp}°C</Text>
                    <Text style={styles.temp}>{weatherCase.title}</Text>
                </View>
                <View style={styles.lower}>
                    <Animated.Text style={this._getTitleStyle()}>{weatherCase.title}</Animated.Text>
                    <Animated.Text style={this._getSubTitleStyle()}>{weatherCase.subtitle[subtitleIndex]}</Animated.Text>
                </View>
            </View>
        )
  }
    
        
}

Weather.propTypes = {
    temp: PropTypes.number.isRequired,
    weatherName: PropTypes.string
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    temp: {
        fontSize: 38,
        color: "white",
        marginTop: 10
    },
    upper: {
        flex:1,
        alignItems:"center",
        justifyContent: "center"
    },
    lower: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-end",
        paddingLeft: 25
    },
    loadingBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }
});
