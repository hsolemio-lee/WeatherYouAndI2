import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    AsyncStorage
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { firestore } from '../../firebase/firebase';
// import Snackbar from 'react-native-snackbar';
// import Toast from 'react-native-simple-toast';

export default class LoginScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            idText: '',
            pwText: ''
        }
    }
    
    static navigationOptions = {
        headerShown: false,
    };

    _doLogin(){
        // do something
        if(this.state.idText.length > 0) {
            const user = firestore.collection('users').doc(this.state.idText);
            user.get().then(doc => {
                const userInfo = doc.data();
                if(userInfo.password === this.state.pwText) {
                    console.log('password match !!!');
                    AsyncStorage.setItem('userId', doc.id);
                    AsyncStorage.setItem('userPassword', userInfo.password);
                    this.props.navigation.replace('TabNavigator');
                } else {
                    console.log('Invalid ID and Password. Please check again.');
                    // Toast.show('Invalid ID and Password. Please check again.');
                    // Snackbar.show({
                    //     text: 'Invalid ID and Password. Please check again.',
                    //     duration: Snackbar.LENGTH_SHORT
                    // });
                }
            });
        } else {
            console.log('ID is empty.');
            // Toast.show('ID is empty.');
            // Snackbar.show({
            //     text: 'ID is empty.',
            //     duration: Snackbar.LENGTH_SHORT
            // });
        }
        
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.titleArea}>
                    <Text style={styles.title}>Weather{"\n"}You & I</Text>
                </View>
                <View style={styles.formArea}>
                    <TextInput
                        onChangeText={(idText) => this.setState({idText})}
                        value={this.state.idText}
                        style={styles.textForm} 
                        placeholder={"ID"}/>
                    <TextInput
                        onChangeText={(pwText) => this.setState({pwText})}
                        value={this.state.pwText}
                        secureTextEntry={true} 
                        style={styles.textForm} 
                        placeholder={"Password"}/>
                </View>
                <View style={styles.buttonArea}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={this._doLogin.bind(this)}>
                        <Text style={styles.buttonTitle}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: wp('10%'),
        paddingRight: wp('10%'),
        justifyContent: 'center',
    },
    titleArea: {
        width: '100%',
        padding: wp('10%'),
        alignItems: 'center',
    },
    title: {
        fontSize: wp('10%'),
    },
    formArea: {
        width: '100%',
        paddingBottom: wp('10%'),
    },
    textForm: {
        borderWidth: 0.5,
        borderColor: '#888',
        width: '100%',
        height: hp('5%'),
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 5,
    },
    buttonArea: {
        width: '100%',
        height: hp('5%'),
    },
    button: {
        backgroundColor: "#46c3ad",
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTitle: {
        color: 'white',
    },
})
