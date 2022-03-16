import Firebase from './firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const SignUpUser = async (email, password) => {
    try {
        return await Firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
        return error;
    }
}
