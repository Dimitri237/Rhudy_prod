
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBX-MaqAVfDaHdrXjNXeOE0Zm1ADEHpbu4",
    authDomain: "opep-new.firebaseapp.com",
    projectId: "opep-new",
    storageBucket: "opep-new.appspot.com",
    messagingSenderId: "990565326767",
    appId: "1:990565326767:web:a801fe53934505cde5995a"
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage();
async function uploadToFirebase(file, fileName) {
    const storageRef = ref(storage, `OpepMedia/images/${fileName}`);
    const uploadTask = uploadBytes(storageRef, file);

    try {
        await uploadTask;
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error);
        throw error;
    }
}

// Initialisation de l'application Firebase


const firestore = getFirestore(firebaseApp);
const db = getFirestore(firebaseApp);

export {
    firebaseApp,
    firestore,
    db,
    uploadToFirebase
}