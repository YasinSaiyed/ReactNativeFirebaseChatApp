import {Text, View, Image} from 'react-native';
import React, {Component} from 'react';
import TextInputComponent from '../Component/TextInputComponent';
import ButtonComponent from '../Component/ButtonComponent';
import {SignUpUser} from '../Firebase/SignUp';
import Firebase from '../Firebase/firebaseConfig';
import {AddUser} from '../Firebase/Users';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

class SignUp extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    loader:false
  };

  SignUPtoFirebase = async () => {
    if(!this.state.name){
      return alert('Please Enter Name')
    }
    if(!this.state.email){
      return alert('Please Enter Email')
    }
    if(!this.state.password){
      return alert ('Please Enter Password')
    }
    this.setState({loader:true})
    SignUpUser(this.state.email, this.state.password)
      .then(async (res) => {
        console.log('res', res);
        var userUID = Firebase.auth().currentUser.uid;
        AddUser(this.state.name, this.state.email, '', userUID)
          .then(async() => {
            this.setState({loader: false});
            await AsyncStorage.setItem('UID', userUID);
            this.props.navigation.navigate('Dashboard')
          })
          .catch(error => {
            this.setState({loader: false});
            alert(error);
          });
        console.log(userUID);
      })
      .catch(err => {
        this.setState({loader: false});
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
          placeholder="Enter Name"
          updateFields={text => this.setState({name: text})}
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
          title="Sign Up"
          onPress={() => {
            this.SignUPtoFirebase();
          }}
        />
        {/*<Spinner
          visible={this.state.loader}
        />*/}
        {this.state.loader && <ActivityIndicator color={"#fff"} />}
      </View>
    );
  }
}
export default SignUp;
