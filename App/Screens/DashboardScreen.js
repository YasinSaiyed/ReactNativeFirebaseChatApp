import {Text, View, TouchableOpacity, FlatList, Image} from 'react-native';
import React, {Component} from 'react';
import 'firebase/compat/auth';
import {UpdateUserImage} from '../Firebase/Users';
import firebase from '../Firebase/firebaseConfig';
import 'firebase/compat/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from '../Component/AppHeader';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import {ActivityIndicator} from 'react-native';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
export default class Dashboard extends Component {
  state = {
    allUsers: [],
    loader: false,
    imageUrl: '',
    loggedInUserName: '',
  };
 async componentDidMount() {
    try {
      this.setState({loader: true});
      await firebase
        .database()
        .ref('users')
        .on('value', async (datasnapshot) => {
          const uuid = await AsyncStorage.getItem('UID');
          new Promise((resolve, reject) => {
            let users = [];
            let lastMessage = '';
            let lastDate = '';
            let lastTime = '';
            let properDate = '';
            datasnapshot.forEach(child => {
              if (child.val().uid === uuid) {
                this.setState({
                  loggedInUserName: child.val().name,
                  imageUrl: child.val().image,
                });
              }else {
                let newUser = {
                  userId: '',
                  userName: '',
                  userProPic: '',
                  lastMessage: '',
                  lastDate: '',
                  lastTime: '',
                  properDate: '',
                };
                new Promise((resolve, reject) => {
                  firebase
                    .database()
                    .ref('messages')
                    .child(uuid)
                    .child(child.val().uid)
                    .orderByKey()
                    .limitToLast(1)
                    .on('value', dataSnapshots => {
                      if (dataSnapshots.val()) {
                        dataSnapshots.forEach(child => {
                          lastMessage =
                            child.val().image !== ''
                              ? 'Photo'
                              : child.val().msg;
                          lastDate = child.val().date;
                          lastTime = child.val().time;
                          
                          properDate =
                            child.val().date + ' ' + child.val().time;
                            
                        });
                      } else {
                        lastMessage = '';
                        lastDate = '';
                        lastTime = '';
                        properDate = '';
                      }
                      newUser.userId = child.val().uid;
                      newUser.userName = child.val().name;
                      newUser.userProPic = child.val().image;
                      newUser.lastMessage = lastMessage;
                      newUser.lastTime = lastTime;
                      newUser.lastDate = lastDate;
                      newUser.properDate = properDate;
                      return resolve(newUser);
                    });
                }).then((newUser) => {
                  users.push({
                    userName: newUser.userName,
                    uuid: newUser.userId,
                    imageUrl: newUser.userProPic,
                    lastMessage: newUser.lastMessage,
                    lastTime: newUser.lastTime,
                    lastDate: newUser.lastDate,
                    properDate: newUser.lastDate
                      ? new Date(newUser.properDate)
                      : null,
                  });
                  
                  this.setState({ allUsers: users.sort((a, b) => b.properDate - a.properDate) });
                });
                return resolve(users);
              }
            
            });
          }).then(users => {
           
            this.setState({ allUsers: users.sort((a, b) => b.properDate - a.properDate) }); 
           
          });
          
          this.setState({loader: false});
        });
       
    } catch (error) {
      alert(error);
      this.setState({loader: false});
    }
  }
 

  logOut = async () => {
    await firebase
      .auth()
      .signOut()
      .then(async () => {
        await AsyncStorage.removeItem('UID');
        this.props.navigation.navigate('Login');
      })
      .catch(err => {
        alert(err);
      });
  };

  openGallery() {
    launchImageLibrary('photo', response => {
      const res = response.assets.map(function (item) {
        return item.uri;
      });
      this.setState({loader: true});
      ImgToBase64.getBase64String(res.toString())
        .then(async base64String => {
          const uid = await AsyncStorage.getItem('UID');
          let source = 'data:image/jpeg;base64,' + base64String;
          UpdateUserImage(source, uid).then(() => {
            this.setState({imageUrl: res, loader: false});
          });
        })
        .catch(err => this.setState({loader: false}));
    });
  }

  

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <AppHeader
          title="Messages"
          navigation={this.props.navigation}
          onPress={() => this.logOut()}
        />
        {this.state.loader && <ActivityIndicator color={'#fff'} />}
        <FlatList
          alwaysBounceVertical={false}
          data={this.state.allUsers}
          style={{padding: 5}}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={
            <View
              style={{
                height: 160,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{height: 90, width: 90, borderRadius: 45}}
                onPress={() => {
                  this.openGallery();
                }}>
                <Image
                  source={{
                    uri:
                      this.state.imageUrl === ''
                        ? 'https://reactnative.dev/img/tiny_logo.png'
                        : this.state.imageUrl.toString(),
                  }}
                  style={{height: 90, width: 90, borderRadius: 45}}
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  marginTop: 10,
                  fontWeight: 'bold',
                }}>
                {this.state.loggedInUserName}
              </Text>
            </View>
          }
          renderItem={({item}) => (
            <View>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('Chat', {
                    UserName: item.userName,
                    guestUid: item.uuid,
                  })
                }
                style={{flexDirection: 'row', marginBottom: 20, marginTop: 20}}>
                <View
                  style={{
                    width: '15%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {
                    <Image
                      source={{
                        uri:
                          item.imageUrl === ''
                            ? 'https://reactnative.dev/img/tiny_logo.png'
                            : item.imageUrl,
                      }}
                      style={{height: 50, width: 50, borderRadius: 25}}
                    />
                  }

                </View>

                <View
                  style={{
                    width: '65%',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                    {item.userName}
                  </Text>
                  <Text
                    style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>
                    {item.lastMessage}
                  </Text>
                </View>
                <View
                  style={{
                    width: '20%',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 13, fontWeight: '400'}}>
                    {item.lastTime}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{borderWidth: 1, borderColor: '#ffffff'}} />
            </View>
          )}
        />
        
      </View>
    );
  }
}


