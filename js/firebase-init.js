// Inicialização do Firebase — carregue APÓS os SDKs compat
const firebaseConfig = {
  apiKey:            "AIzaSyCi0IcauONAdkkzMHyw7Q-_HfcRu6Fs-Lo",
  authDomain:        "pokebena.firebaseapp.com",
  projectId:         "pokebena",
  storageBucket:     "pokebena.firebasestorage.app",
  messagingSenderId: "858709660960",
  appId:             "1:858709660960:web:98cd83ec16ee14b6b1f345"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
