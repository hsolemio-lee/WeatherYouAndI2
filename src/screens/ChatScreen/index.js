import React from 'react';
import {Platform, KeyboardAvoidingView, SafeAreaView, AsyncStorage, StyleSheet, RecyclerViewBackedScrollView} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import Fire, {firestore} from '../../firebase/firebase';
import { Header } from 'react-navigation-stack';



export default class ChatScreen extends React.Component {

    state = {
        messages: []
    }

    getUserData = async() => {
        const user = await AsyncStorage.getItem('user');
        if(user != null) {
            return {
                _id: user,
                name: user
            }
        } else {
            const resetAction = StackActions.reset({
                index: 0,
                key: null,
                actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
            });
            this.props.navigation.dispatch(resetAction);
            AsyncStorage.clear();
        }
    }

    componentDidMount() {
        if(!this.user) {
            this.getUserData().then(val => {
                this.user = val;
                if(!this.toToken) {
                    firestore.collection('users').get()
                    .then(docs => {
                        this.toToken = docs.filter(doc => doc.id !== val)[0]
                    });
                }
            });
        }
        Fire.get(message => this.setState(previous => ({
            messages: GiftedChat.append(previous.messages, message)
        })));
    }

    componentWillUnmount() {
        Fire.off();
    }

    sendMessage(messages) {
        Fire.send(messages);
        let response = fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: `ExponentPushToken[${this.toToken}]`,
                sound: 'default',
                title: 'WeatherYou&I',
                body: messages
            })
        });
    }

    render() {
        console.log('this.user',this.user);
        const chat = <GiftedChat messages={this.state.messages} onSend={this.sendMessage} user={this.user} />;

        if (Platform.OS === 'android') {
            return (
                <KeyboardAvoidingView style={{flex: 1}} behavior="height" keyboardVerticalOffset={Header.HEIGHT+30} enable>
                    {chat}
                </KeyboardAvoidingView>
            )
        }
        return (
            <SafeAreaView style={{flex:1}}>{chat}</SafeAreaView>
        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
