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
    borderColor: '#666d',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#222d',
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
