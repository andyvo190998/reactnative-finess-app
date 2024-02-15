import { SplashScreen, Stack } from 'expo-router';
import { useCallback } from 'react';
import { useFonts } from 'expo-font';
import { AuthProvider } from './context/AuthContext';
// import * from SplashScreen from 'expo-splash-screen'

// SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
    // Ensure any route can link back to `/`
    initialRouteName: 'user/index',
};

const Layout = () => {
    const [fontsLoaded] = useFonts({
        DMBold: require('../assets/fonts/DMSans-Bold.ttf'),
        DMMedium: require('../assets/fonts/DMSans-Medium.ttf'),
        DMRegular: require('../assets/fonts/DMSans-Regular.ttf')
    })

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    if (!fontsLoaded) return null
    return (
        <AuthProvider>
            <Stack
                onLayout={onLayoutRootView}
                screenOptions={{
                    headerShown: false
                }}
            />
        </AuthProvider>

    )
};

export default Layout;
