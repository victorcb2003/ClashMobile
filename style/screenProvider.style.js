import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    height: 66,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    zIndex: 99,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    height: 46,
    borderRadius: 12,
  },
  tabItemActive: {
    backgroundColor: '#dcfce7',
  },
});
