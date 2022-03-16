import { createAppContainer, createStackNavigator, createSwitchNavigator } from "react-navigation";

import SignUp from "./SignUpScreen";
import Login from "./LoginScreen";
import Dashboard from './DashboardScreen';
import Chat from "./ChatScreen";

const AuthStack = createStackNavigator({
    Login:Login,
    SignUp:SignUp,
    
},{
    headerMode:'none', initialRouteName:'Login'
});

const DashboardStack = createStackNavigator({
    Dashboard: Dashboard,
    Chat: Chat
},
{
    headerMode:'none', initialRouteName:'Dashboard'
})

const App = createSwitchNavigator({
    Auth:AuthStack,
    Dashboard: DashboardStack
},
{initialRouteName:'Auth'});  

export default createAppContainer(App);