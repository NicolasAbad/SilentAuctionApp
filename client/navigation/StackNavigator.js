
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../components/LoginScreen';
import SignupScreen from '../components/SignupScreen';
import HomeScreen from '../components/HomeScreen';
import MyBidsScreen from '../components/MyBidsScreen';
import AccountScreen from '../components/AccountScreen';
import ItemDetailScreen from '../components/ItemDetailScreen';
import AdminCreateAuction from '../components/AdminCreateAuction';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MyBids" component={MyBidsScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      <Stack.Screen name="CreateAuction" component={AdminCreateAuction} />
    </Stack.Navigator>
  );
}
