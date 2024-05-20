/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import ScanTagScreen from './screens/ScanTagScreen';
import WriteTagScreen from './screens/WriteTagScreen';

// Screen names
const scanTagName = 'Scan Tag';
const writeTagName = 'Write Tag';

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={scanTagName}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let rn = route.name;

            if (rn === scanTagName) {
              iconName = focused ? '' : '';
            } else if (rn === writeTagName) {
              iconName = focused ? '' : '';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'grey',
          tabBarLabelStyle: {paddingBottom: 20, fontSize: 15},
          tabBarStyle: {padding: 10, height: 60},
        })}>
        <Tab.Screen name={scanTagName} component={ScanTagScreen} />
        <Tab.Screen name={writeTagName} component={WriteTagScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
