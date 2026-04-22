import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from './AuthProvider';

import Login from '../screen/Login';
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

const HIDDEN = new Set(['MatchDisplay', 'EquipeDisplay']);

const routeIcons = {
  Login:       'login',
  Inscription: 'person-add',
  Home:        'home',
  Tournois:    'emoji-events',
  Match:       'sports-soccer',
  Equipe:      'groups',
  Calendrier:  'calendar-today',
  Admin:       'admin-panel-settings',
  Profil:      'person',
};

function MyTabBar({ state, navigation }) {
  const visibleRoutes = state.routes.filter(r => !HIDDEN.has(r.name));

  return (
    <View style={s.tabBar}>
      {visibleRoutes.map((route) => {
        const routeIndex = state.routes.findIndex(r => r.key === route.key);
        const isFocused = state.index === routeIndex;
        const iconName = routeIcons[route.name] || 'circle';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={[s.tabItem, isFocused && s.tabItemActive]}
          >
            <MaterialIcons
              name={iconName}
              size={22}
              color={isFocused ? '#14532d' : '#86efac'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function ScreenProvider() {
  const { isAuthenticated, isAdmin, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <SafeAreaView style={s.loaderContainer}>
        <ActivityIndicator size="large" color="#4ade80" />
      </SafeAreaView>
    );
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
        screenOptions={{ swipeEnabled: false }}
        style={{ backgroundColor: '#0000' }}
      >
        {!isAuthenticated ? (
          <>
            <Tab.Screen name="Login"       component={Login} />
            <Tab.Screen name="Inscription" component={Register} />
          </>
        ) : (
          <>
            <Tab.Screen name="Home"       component={Home} />
            <Tab.Screen name="Tournois"   component={Tournois} />
            <Tab.Screen name="Match"      component={Match} />
            <Tab.Screen name="Equipe"     component={Equipe} />
            <Tab.Screen name="Calendrier" component={Calendrier} />
            {isAdmin && <Tab.Screen name="Admin" component={Admin} />}
            <Tab.Screen name="Profil"     component={Profil} />
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
  );
}

const s = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(5, 15, 5, 0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(74, 222, 128, 0.2)',
    paddingHorizontal: 8,
    paddingBottom: 30,
    alignItems: 'center',
    zIndex: 99,
    height: 90,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    borderRadius: 12,
  },
  tabItemActive: {
    backgroundColor: 'rgba(220, 252, 231, 0.9)',
  },
});