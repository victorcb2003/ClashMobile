import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useAuth } from './AuthProvider';
import Login from '../screen/Login'
import Register from '../screen/Register';
import Home from '../screen/Home';
import Tournois from '../screen/Tournois';
import Match from '../screen/Match';
import Equipe from '../screen/Equipe';
import Profil from '../screen/Profil';
import Admin from '../screen/Admin';
import Calendrier from '../screen/Calendrier';

const Tab = createMaterialTopTabNavigator();

// 👇 Custom Tab Bar en bas
function MyTabBar({ state, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabItem}
          >
            <Text style={{ color: isFocused ? 'black' : 'gray' }}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function ScreenProvider() {
  const { isAuthenticated, isAdmin, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} />}
        screenOptions={{
          swipeEnabled: true,
        }}
      >
        {!isAuthenticated ? (
          <>
            <Tab.Screen name="Login" component={Login} />
            <Tab.Screen name="Inscription" component={Register} />
          </>
        ) : (
          <>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Tournois" component={Tournois} />
            <Tab.Screen name="Match" component={Match} />
            <Tab.Screen name="Equipe" component={Equipe} />
            <Tab.Screen name="Profil" component={Profil} />
            <Tab.Screen name="Calendrier" component={Calendrier} />
            {isAdmin && <Tab.Screen name="Admin" component={Admin} />}
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    zIndex: 99,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});