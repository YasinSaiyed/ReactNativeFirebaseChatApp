import Firebase from 'firebase/compat/app';


const firebaseConfig = {
    apiKey: "Your API key",
    databaseURL: "database url",
    projectId: "project id",
    appId: "app id",
};

export default Firebase.initializeApp(firebaseConfig);