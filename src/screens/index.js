import React from "react";
import { Text } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import LoginScreen from "./LoginScreen";
import HomeScreen from "./HomeScreen";
import SettingScreen from "./SettingScreen";
import SomethingScreen from "./SomethingScreen";
import YourWeather from "./YourWeatherScreen";
import ChatScreen from "./ChatScreen";

const HomeStack = createStackNavigator(
  {
    HomeScreen,
  },
  // if you need.
  // recommend custom header
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: "Weather",
    }),
  }
);

const YourWeatherStack = createStackNavigator(
  {
    YourWeather,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: "Your Weather"
    }),
  }
);

const ChatStack = createStackNavigator(
  {
    ChatScreen
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      title: "Chat"
    }),
  }
)



const SettingStack = createStackNavigator(
  {
    SettingScreen,
    SomethingScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: "Setting",
    }),
    initialRouteName: "SettingScreen",
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Weather: {
      screen: HomeStack,
      navigationOptions: {
        title: 'Weather'
      }
    },
    YourWeather: {
      screen: YourWeatherStack,
      navigationOptions: {
        title: 'Your Weather'
      }
    },
    ChatScreen: {
      screen: ChatStack,
      navigationOptions: {
        title: 'Chat'
      }
    },
    Setting: SettingStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let icon = "▲";

        if (routeName === "Weather") {
          icon = "🌈";
        } else if (routeName === "YourWeather") {
          icon = "💖";
        } else if (routeName === "Chat") {
          icon = "💬";
        } else if (routeName === "Setting") {
          icon = "🌙";
        }

        // can use react-native-vector-icons
        // <Icon name={iconName} size={iconSize} color={iconColor} />
        return (
          <Text style={{ color: (focused && "#46c3ad") || "#888" }}>
            {icon}
          </Text>
        );
      },
    }),
    lazy: false,
    tabBarOptions: {
      activeTintColor: "#46c3ad",
      inactiveTintColor: "#888",
    },
  }
);

const AppStack = createStackNavigator({
  LoginScreen: LoginScreen,
  TabNavigator: {
    screen: TabNavigator,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
});

export default createAppContainer(AppStack);
