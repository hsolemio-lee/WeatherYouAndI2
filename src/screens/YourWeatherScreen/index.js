import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    KeyboardAvoidingView, 
    TouchableWithoutFeedback, 
    Keyboard,
    AsyncStorage,
    Animated,
    TouchableHighlightBase
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { firestore } from '../../firebase/firebase'

export default class YourWeather extends Component{
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            yourWeatherMessage: '당신의 기분을 입력하세요.',
            myWeatherMessage: '당신의 기분을 입력하세요.',
            yourWeatherOpacity: new Animated.Value(0),
            myWeatherOpacity: new Animated.Value(0),
        }

        this._saveMessage = this._saveMessage.bind(this);
        this._getMessages = this._getMessages.bind(this);
        this._getMyWeatherMessageStyle = this._getMyWeatherMessageStyle.bind(this);
        this._getYourWeatherMessageStyle = this._getYourWeatherMessageStyle.bind(this);
        this._fadeIn = this._fadeIn.bind(this);
        this._fadeOut = this._fadeOut.bind(this);
    }

    componentDidMount() {
        this._getMessages();
    }

    _fadeIn(){
        Animated.parallel([
            Animated.timing(this.state.myWeatherOpacity, {
              toValue : 1,
              duration : 1000,
              //easing : Easing.bounce,
              delay : 0,
              useNativeDriver: true,
            }),
            Animated.timing(this.state.yourWeatherOpacity, {
                toValue : 1,
                duration : 1000,
                //easing : Easing.bounce,
                delay : 0,
                useNativeDriver: true,
            }),
        ]).start();
    }
  
    _fadeOut(){
        Animated.parallel([
          Animated.timing(this.state.myWeatherOpacity, {
            toValue : 0,
            duration : 1000,
            //easing : Easing.bounce,
            delay : 0,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.yourWeatherOpacity, {
            toValue : 1,
            duration : 1000,
            //easing : Easing.bounce,
            delay : 0,
            useNativeDriver: true,
          }),
        ]).start(() => {
            this._getMessages();
        });
    }

    _getMyWeatherMessageStyle() {
        const style = {
            color: 'white', 
            fontSize: 30,
            opacity: this.state.myWeatherOpacity
        }
        return style;  
    }

    _getYourWeatherMessageStyle() {
        const style = {
            color: 'white', 
            fontSize: 30,
            opacity: this.state.yourWeatherOpacity
        }
        return style;  
    }

    _getMessages() {
        const yourWeather = firestore.collection('yourWeather').doc('jimin3248');
        const myWeather = firestore.collection('yourWeather').doc('hsolemio');
        yourWeather.get().then(doc => {
            this._fadeIn();
            this.setState({yourWeatherMessage: doc.data().message});
        });
        myWeather.get().then(doc => {
            this._fadeIn();
            this.setState({myWeatherMessage: doc.data().message});
        });
    }
    
    _saveMessage() {
        AsyncStorage.getItem('user').then(userId => {
            firestore.collection('yourWeather').doc(userId).set({
                message: this.state.message
            })
            .then(() => {
                console.log("message save success!!");
                this.textInput.clear();
                this._fadeOut();
            })
            .catch((err) => {
                console.log('error!!!');
            });
            
        });
    }  
    

    render(){
        const {yourWeatherMessage, myWeatherMessage} = this.state;

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
                    <LinearGradient
                            colors = {['#FEF253', '#FF7300']}
                            style = {styles.container}> 
                        <View style={styles.content}>
                            <Text style={styles.title}>Jimin's weather</Text>
                            <Animated.Text style={this._getYourWeatherMessageStyle()}>{yourWeatherMessage}</Animated.Text>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.title}>Hansol's weather</Text>
                            <Animated.Text style={this._getMyWeatherMessageStyle()}>{myWeatherMessage}</Animated.Text>
                        </View>
                        <View style={styles.footer} >
                            <TouchableOpacity style={styles.inputContainer}>
                            <TextInput 
                                ref={input => {this.textInput = input}}
                                style={styles.inputs}
                                placeholder="본인의 날씨(기분, 컨디션)를 표현해 보세요~"
                                underlineColorAndroid='transparent'
                                onChangeText={(text)=>{
                                    this.setState({
                                        message: text
                                    });
                                }
                            }/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSend} onPress={this._saveMessage}>
                                <Ionicons name="ios-send" color="white"/>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
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
        flex: 1,
        width: "100%",
        height: "100%",
    },
    title: {
        fontSize: 38,
        color: "white",
        marginBottom: 10,
        fontWeight: "300"
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        height:40,
        flexDirection: 'row',
        alignItems:'center',
        flex:1,
        marginRight:10,
    },
    footer:{
        flexDirection: 'row',
        flex : 1,
        height:60,
        backgroundColor: 'transparent',
        paddingHorizontal:10,
        padding:5,
    },
    btnSend:{
        backgroundColor:"#00BFFF",
        width:40,
        height:40,
        borderRadius:360,
        alignItems:'center',
        justifyContent:'center',
    },
    inputs:{
        height:40,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
})
