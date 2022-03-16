import Firebase from './firebaseConfig';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const LoginUser = async (email, password) => {
    try {
        return await Firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
        return error;
    }
}
