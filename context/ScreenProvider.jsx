import { View, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from './AuthProvider';
import { styles } from '../style/screenProvider.style';
import Login from '../screen/Login'
import Register from '../screen/Register';
import Home from '../screen/Home';
import Tournois from '../screen/Tournois';
import Match from '../screen/Match';
import Equipe from '../screen/Equipe';
import MatchDisplay from '../screen/MatchDisplay';
import EquipeDisplay from '../screen/EquipeDisplay';
import Profil from '../screen/Profil';
import Admin from '../screen/Admin';
import Calendrier from '../screen/Calendrier';

const Tab = createMaterialTopTabNavigator();

const routeIcons = {
  Login: 'login',
  Inscription: 'person-add',
  Home: 'home',
  Tournois: 'emoji-events',
  Match: 'sports-soccer',
  Equipe: 'groups',
  Profil: 'person',
  Calendrier: 'calendar-today',
  Admin: 'admin-panel-settings',
}

function MyTabBar({ state, descriptors, navigation }) {
  const visibleRoutes = state.routes.filter((route) => descriptors[route.key]?.options?.tabBarVisible !== false)

  return (
    <View style={styles.tabBar}>
      {visibleRoutes.map((route) => {
        const routeIndex = state.routes.findIndex((r) => r.key === route.key)
        const isFocused = state.index === routeIndex;
        const iconName = routeIcons[route.name] || 'circle';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
          >
            <MaterialIcons
              name={iconName}
              size={22}
              color={isFocused ? '#14532d' : '#BED3E5'}
            />
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

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} />}
        screenOptions={{
          swipeEnabled: true,
        }}
        style={{ backgroundColor: "#0000" }}
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
            <Tab.Screen
              name="MatchDisplay"
              component={MatchDisplay}
              options={{ tabBarVisible: false, swipeEnabled: false }}
            />
            <Tab.Screen
              name="EquipeDisplay"
              component={EquipeDisplay}
              options={{ tabBarVisible: false, swipeEnabled: false }}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  )
}