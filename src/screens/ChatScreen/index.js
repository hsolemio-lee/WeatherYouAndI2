import React from 'react';
import {Platform, KeyboardAvoidingView, SafeAreaView, AsyncStorage, StyleSheet, RecyclerViewBackedScrollView} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import Fire from '../../firebase/firebase';


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
        this.getUserData().then(val => {
            this.user = val;
        });
        Fire.get(message => this.setState(previous => ({
            messages: GiftedChat.append(previous.message, message)
        })));
    }

    componentWillUnmount() {
        Fire.off();
    }

    render() {
        console.log('this.user',this.user);
        const chat = <GiftedChat messages={this.state.messages} onSend={Fire.send} user={this.user} />;

        if (Platform.OS === 'android') {
            return (
                <KeyboardAvoidingView style={{flex: 1}} behavior="padding" keyboardVerticalOffset={30} enable>
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
