import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import LoginScreen from './screens/Login';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home1 from './screens/Home1/Home1';
import Lake from './screens/Lakes/Lake';
import Booking from './screens/MainLake/Booking';
import BookingPage from './screens/Booking/BookingPage';
import Userbookingpage from './screens/Userbooking/Userbooking';
import Favourite from './screens/Favourites/favourite';
import Profile from './screens/Profile/profile';
import EditProfile from './screens/EditProfile/EditProfile';
import ChangePassword from './screens/ChangePassword/ChangePassword';
import SignUp1 from './screens/signup/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';


const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();

const App = () => {
  const Mytheme = {
    colors: {
      background: 'black',
      primary: '#4DED75',
    },
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer theme={Mytheme}>
      <FlashMessage position="top" />
      <StackNav.Navigator screenOptions={{ headerShown: false }}>
        <StackNav.Screen name="Login" component={LoginScreen} />
        <StackNav.Screen name="Home" component={HomeStack} />
        <StackNav.Screen name="Signup1" component={SignUp1} />
        <StackNav.Screen name="EditProfile" component={EditProfile} />
        <StackNav.Screen name="ChangePassword" component={ChangePassword} />
        <StackNav.Screen name="Booking" component={Booking} />
        <StackNav.Screen name="BookingPage" component={BookingPage} />
        <StackNav.Screen name="Userbookingpage1" component={Userbookingpage} />
        <StackNav.Screen name="Lake" component={Lake} />
      </StackNav.Navigator>
    </NavigationContainer>
  );
};

const HomeStack = () => {
  const [isLabelVisible, setIsLabelVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsLabelVisible(true);

      return () => {
        setIsLabelVisible(false);
      };
    }, [])
  );

  return (
    <StackNav.Navigator screenOptions={{ headerShown: false }}>
      <StackNav.Screen name="TabNavigator" component={TabNavigator} />
    </StackNav.Navigator>
  );
};

const TabNavigator = () => {
  const [isLabelVisible, setIsLabelVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsLabelVisible(true);

      return () => {
        setIsLabelVisible(false);
      };
    }, [])
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home1') {
            iconName = 'home';
          } else if (route.name === 'UserBooking') {
            iconName = 'calendar-o';
          } else if (route.name === 'Favourites') {
            iconName = 'heart-o';
          } else if (route.name === 'Profile') {
            iconName = 'user-o';
          }

          return <Icon name={iconName} color={color} size={19} style={{ marginLeft: 6 }} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#CCCCCC',
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveBackgroundColor: '#4DED75',
        tabBarInactiveBackgroundColor: 'black',
        tabBarStyle: {
          backgroundColor: 'black',
          paddingTop: 15,
          paddingBottom: 10,
          height: 70,
          width: '100%'
        },
        tabBarItemStyle: {
          borderRadius: 30,

        },
      })}

    >
      <Tab.Screen
        name="Home1"
        component={Home1}
        options={{
          tabBarLabel: ({ focused }) => {
            return isLabelVisible && focused ? <TabLabel label="Home" /> : null;
          },
        }}
      />
      <Tab.Screen
        name="UserBooking"
        component={Userbookingpage}
        options={{
          tabBarLabel: ({ focused }) => {
            return isLabelVisible && focused ? <TabLabel label="Booking" /> : null;
          },
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={Favourite}
        options={{
          tabBarLabel: ({ focused }) => {
            return isLabelVisible && focused ? <TabLabel label="Favourite" /> : null;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => {
            return isLabelVisible && focused ? <TabLabel label="Profile" /> : null;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const TabLabel = ({ label }) => (
  <Text style={{ color: 'black', fontSize: 11, fontFamily: 'audiowide_regular', fontWeight: '400', marginLeft: 20 }}>{label}</Text>
);

export default App;
