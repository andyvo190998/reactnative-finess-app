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
LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

const StackNav = ({ navigation }) => {
  const handlePress = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }
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
            <ScreenHeaderBtn iconUrl={images.profile} dimension="100%" />
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

          <Welcome />
          <TrainingList navigation={navigation} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default function Home() {
  const Drawer = createDrawerNavigator();

  return (
    // <StackNav />
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName='StartingPage'
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false
        }}>
        {/* {authState.authenticated ? (
          <> */}
        <Drawer.Screen name="Home" component={StackNav} initialParams={{ itemId: 42 }} />
        {/* </>
        ) : (
          <> */}
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Register" component={RegisterPage} />
        <Drawer.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Drawer.Screen name="Training" component={TrainingScreen} options={{ headerShown: true }} />
        <Drawer.Screen name="Subscription" component={Subscription} options={{ headerShown: true }} />
        {/* </>
        )} */}
        <Drawer.Screen name="StartingPage" component={StartingPage} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
