import { Stack } from 'expo-router';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { LogBox } from 'react-native';

import { COLORS, icons, images, SIZES } from '../constants';
import {
  TrainingList,
  ScreenHeaderBtn,
  Welcome,
  DrawerContent,
  StartingPage,
  LoginScreen,
  RegisterPage,
  Profile,
  TrainingScreen,
  Subscription
} from '../components';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
import * as ScreenOrientation from "expo-screen-orientation";
import { useAuth } from './context/AuthContext';


const StackNav = ({ navigation }) => {
  const handlePress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const handleNavigateHome = () => {
    navigation.navigate('Profile');
  };
  const [trainingLevel, setTrainingLevel] = useState('Beginner');
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" handlePress={handlePress} />
          ),
          headerRight: () => (
            <ScreenHeaderBtn handlePress={handleNavigateHome} iconUrl={images.profile} dimension="100%" />
          ),
          headerTitle: '',
          headerShown: true,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
          }}
        >

          <Welcome setTrainingLevel={setTrainingLevel} navigation={navigation} />
          <TrainingList navigation={navigation} trainingLevel={trainingLevel} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function Home() {
  const Drawer = createDrawerNavigator();
  const { authState } = useAuth();
  console.log(authState);
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, []);
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName='StartingPage'
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false
        }}>
        {authState.authenticated && (
          <>
            <Drawer.Screen name="Home" component={StackNav} initialParams={{ itemId: 42 }} />
            <Drawer.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Drawer.Screen name="Training" component={TrainingScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="Subscription" component={Subscription} options={{ headerShown: false }} />
          </>
        )}
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Register" component={RegisterPage} />
        <Drawer.Screen name="StartingPage" component={StartingPage} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
