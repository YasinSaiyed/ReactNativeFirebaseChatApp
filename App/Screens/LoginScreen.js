import {Text, View, TouchableOpacity, Image} from 'react-native';
import React, {Component} from 'react';
import TextInputComponent from '../Component/TextInputComponent';
import ButtonComponent from '../Component/ButtonComponent';
import Firebase from '../Firebase/firebaseConfig';
import {LoginUser} from '../Firebase/LoginUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from "react-native";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
class Login extends Component {
  state = {
    email: '',
    password: '',
    loader:false
  };

  async componentDidMount(){
    this.setState({loader:true})
    const uid = await AsyncStorage.getItem('UID');
    if(uid){
      this.props.navigation.navigate('Dashboard');
      this.setState({loader:false})
    }
    this.setState({loader:false})
  }

  LogintoFirebase = async () => {
    if(!this.state.email){
      return alert('Please Enter Email')
    }
    if(!this.state.password){
      return alert ('Please Enter Password')
    }
    this.setState({loader:true})
    
    LoginUser(this.state.email, this.state.password)
      .then(async (res) => {
        const uid = Firebase.auth().currentUser.uid;
        await AsyncStorage.setItem('UID', uid)
        console.log('res', res);
        this.setState({loader:false})
        this.props.navigation.navigate('Dashboard');
      })
      .catch(err => {
        this.setState({loader:false})
        alert(err);
      });
  };

  render() {
    return (
     <View
        style={{
          flex: 1,
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        
         <Image
                  source={require('../Screens/IMG_20200914_122207.jpg')}
                  style={{height: 100, width: 100, borderRadius: 50,marginBottom: 30}}
                />
         <TextInputComponent
          placeholder="Enter Email"
          updateFields={text => this.setState({email: text})}
        />
        <TextInputComponent
          placeholder="Enter Password"
          updateFields={text => this.setState({password: text})}
        />
        <ButtonComponent
          title="Login"
          onPress={() => {
            this.LogintoFirebase();
          }}
        />

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('SignUp');
          }}
          style={{marginTop: 20}}>
          <Text style={{fontSize: 16, color: '#ffffff', fontWeight: 'bold'}}>
            New User? Click Here
          </Text>
        </TouchableOpacity>

        {/*<Spinner
          visible={this.state.loader}
         
        />*/}
        {this.state.loader && <ActivityIndicator color={"#fff"} />}
        
        
        

        
        </View>
       
    );
  }
}
export default Login;


