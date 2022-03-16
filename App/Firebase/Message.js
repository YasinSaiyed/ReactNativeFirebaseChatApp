import Firebase from './firebaseConfig';
import 'firebase/compat/database';
import moment from 'moment';
export const SendMessage = async (currentUserId, guestUserId, msgValue, imgSource) => {
 var todayDate = moment();
  try {
    return await Firebase.database()
      .ref('messages/' + currentUserId)
      .child(guestUserId)
      .push({
        sender: currentUserId,
        receiver: guestUserId,
        msg: msgValue,
        image: imgSource,
        date:todayDate.format('YYYY-MM-DD'),
        time:todayDate.format('hh:mm A')
      });
  } catch (error) {
    return error;
  }
};

export const ReceiveMessage = async (currentUserId, guestUserId, msgValue, imgSource) => {
    try {
      var todayDate = moment();
      return await Firebase.database()
        .ref('messages/' + guestUserId)
        .child(currentUserId)
        .push({
          sender: currentUserId,
          receiver: guestUserId,
          msg: msgValue,
          image: imgSource,
          date:todayDate.format('YYYY-MM-DD'),
        time:todayDate.format('hh:mm A')
        });
    } catch (error) {
      return error;
    }
  };
