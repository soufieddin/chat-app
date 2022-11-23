import { NavigationContainer } from '@react-navigation/native';
import navigationTheme from './app/navigation/navigationTheme';
import AuthNavigator from './app/navigation/AuthNavigator';
import { navigationRef } from './app/navigation/rootNavigation';
import { useAuth, AuthProvider } from './app/firebase/auth';
import OfflineNotice from './app/components/OfflineNotice';
import AppNavigator from './app/navigation/AppNavigator';


export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>

  )
}

function AppContent() {
  const { user } = useAuth();


  // Notifications.setNotificationHandler({

  //   handleNotification: async () => {
  //     return {
  //       shouldPlaySound: true,
  //       shouldShowAlert: true,
  //       shouldSetBadge: true,
  //     }
  //   }
  // })

  return (
    <>
      <OfflineNotice />
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        { user ? ( <AppNavigator />) : ( <AuthNavigator /> ) }
        
      </NavigationContainer>
    </>
  );
}


