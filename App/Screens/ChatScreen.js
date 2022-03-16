import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {Component} from 'react';
import firebase from '../Firebase/firebaseConfig';
import {ActivityIndicator} from 'react-native';
import {LogBox} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {SendMessage, ReceiveMessage} from '../Firebase/Message';
import AppHeader from './../Component/AppHeader';
import {TextInput} from 'react-navigation/node_modules/react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import moment from 'moment'
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
class Chat extends Component {
  state = {
    message: '',
    guestUid: '',
    currentUid: '',
    allMessages: [],
    image: '',
  };

  async componentDidMount() {
    const currentUid = await AsyncStorage.getItem('UID');
    const guestUid = this.props.navigation.getParam('guestUid');
    this.setState({currentUid: currentUid, guestUid: guestUid});

    try {
      firebase
        .database()
        .ref('messages')
        .child(currentUid)
        .child(guestUid)
        .on('value', dataSnapshot => {
          let message = [];
          dataSnapshot.forEach(data => {
            message.push({
              sendBy: data.val().sender,
              receiveBy: data.val().receiver,
              msg: data.val().msg,
              image: data.val().image,
              date: data.val().date,
              time: data.val().time,
            });
          });
          this.setState({allMessages: message.reverse()});
          console.log('All Messages', this.state.allMessages);
        });
    } catch (error) {
      alert(error);
    }
  }

  openGallery() {
    launchImageLibrary('mixed', response => {
      const res = response.assets.map(function (item) {
        return item.uri;
      });
      this.setState({loader: true});
      ImgToBase64.getBase64String(res.toString())
        .then(async base64String => {
          
          let source = 'data:image/jpeg;base64,' + base64String;
          SendMessage(this.state.currentUid, this.state.guestUid, '', source)
            .then(res => {
              this.setState({loader: false});
            })
            .catch(err => {
              alert(err);
            });

          ReceiveMessage(this.state.currentUid, this.state.guestUid, '', source)
            .then(res => {
              this.setState({loader: false});
            })
            .catch(err => {
              alert(err);
            });
        })
        .catch(err => this.setState({loader: false}));
    });
  }

  sendMessage = async () => {
    if (this.state.message) {
      console.log('Success');
      SendMessage(
        this.state.currentUid,
        this.state.guestUid,
        this.state.message,
        '',
      )
        .then(res => {
          console.log(res);
          this.setState({message: ''});
        })
        .catch(err => {
          alert(err);
        });

      ReceiveMessage(
        this.state.currentUid,
        this.state.guestUid,
        this.state.message,
        '',
      )
        .then(res => {
          console.log(res);
          this.setState({message: ''});
        })
        .catch(err => {
          alert(err);
        });
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#000',
        }}>
        <AppHeader
          title={this.props.navigation.getParam('UserName')}
          navigation={this.props.navigation}
          onPress={() => this.logOut()}
        />
        <FlatList
          style={{marginBottom: 50}}
          inverted
          data={this.state.allMessages}
          keyExtractor={(_,index) => index.toString()}
          renderItem={({item}) => (
            <View
            
              style={{
                margin: 5,
                maxWidth: Dimensions.get('window').width / 2 + 10,
                alignSelf:
                  this.state.currentUid === item.sendBy
                    ? 'flex-end'
                    : 'flex-start',
              }}>
              <View
                style={{
                  borderRadius: 10,
                  //margin: 5,
                  backgroundColor:
                    // this.state.currentUid === item.sendBy ? '#ffbe7bff' : '#eed971ff',
                    this.state.currentUid === item.sendBy
                      ? 'turquoise'
                      : '#ffbe7bff',
                }}>
                {item.image === '' ? (
                  <Text
                    style={{
                      padding: 10,
                      fontSize: 16,
                      color: '#000000',
                      fontWeight: 'bold',
                    }}>
                    {item.msg} {" "}<Text style={{fontSize: 12, color:'gray'}}>{item.time}</Text>
                  </Text>
                ) : (
                  <View>
                  <Image
                    source={{uri: item.image}}
                    style={{
                      width: Dimensions.get('window').width / 2 + 10,
                      height: 150,
                      borderRadius: 10,
                      resizeMode:'stretch'
                    }}
                  />
                  <Text style={{fontSize: 12,position:'absolute', bottom: 5, right: 5, color:'#000000', fontWeight:'bold'}}>{item.time}</Text></View>
                )}
              </View>
            </View>
          )}
        />
        <View
          style={{
            bottom: 0,
            height: 50,
            width: '100%',
            position: 'absolute',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => this.openGallery()}
            style={{width: '10%', justifyContent: 'center', marginRight: 5}}>
            <Icons name="camera-alt" size={30} color="#ffffff" />
          </TouchableOpacity>
          <View style={{width: '75%', justifyContent: 'center'}}>
            <TextInput
              placeholder="Type Your Message"
              placeholderTextColor="#000000"
              onChangeText={text => this.setState({message: text})}
              value={this.state.message}
              style={{
                height: 40,

                borderWidth: 1,
                backgroundColor: '#ffffff',
                borderRadius: 20,
                padding: 10,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => this.sendMessage()}
            style={{width: '10%', justifyContent: 'center', marginLeft: 10}}>
            <Icons
              name="send"
              size={30}
              style={[{color: this.state.message ? 'yellow' : 'white'}]}
            />
          </TouchableOpacity>
        </View>

        {this.state.loader && <ActivityIndicator color={'#fff'} />}
      </View>
    );
  }
}
export default Chat;
