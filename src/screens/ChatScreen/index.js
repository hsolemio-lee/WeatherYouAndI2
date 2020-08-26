import React from 'react';
import {Platform, KeyboardAvoidingView, SafeAreaView, AsyncStorage, StyleSheet, RecyclerViewBackedScrollView} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import Fire, {firestore} from '../../firebase/firebase';
import { Header } from 'react-navigation-stack';



export default class ChatScreen extends React.Component {

    state = {
        messages: [],
    }

    getUserData = async() => {
        const userId = await AsyncStorage.getItem('userId');
        if(userId !== null) {
            return {
                _id: userId,
                name: userId
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
                if(!this.pushToken) {
                    firestore.collection('users').get()
                    .then(docs => {
                        docs.forEach(doc => {
                            if(doc.id !== this.user._id && doc.data().token && doc.data().token.length > 0) {
                                this.pushToken = doc.data().token;
                                console.log(this.pushToken);
                            }
                        });
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
    }

    sendPush(messages) {
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: this.pushToken,
                sound: 'default',
                title: messages[0].user.name,
                body: messages[0].text
            })
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
        });
    }

    render() {
         const chat = <GiftedChat 
                        renderUsernameOnMessage={true} messages={this.state.messages} 
                        onSend={(messages) => {
                                this.sendMessage(messages);
                                this.sendPush(messages);
                        }} 
                        user={this.user} />;

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
