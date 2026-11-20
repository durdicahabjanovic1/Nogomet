

import { collection, doc, updateDoc,getDoc, getDocs, addDoc, deleteDoc, Timestamp } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

async function get() {
    const skupKlubova = collection(getFirebaseDB(), PrefixStorage.KLUBOVI);
    const kluboviSnapshot = await getDocs(skupKlubova);
    return {success: true, data: kluboviSnapshot.docs.map(doc => {
        const data = doc.data();
        const d = data.datumPokretanja ? data.datumPokretanja.toDate() : new Date();
        const isoDatum = d.toISOString();
        return {
            sifra: doc.id,
            ...data,
            datumPokretanja: isoDatum 
        };
    }) }
}

async function dodaj(klub) {
    const dateObj = new Date(klub.datumPokretanja);
    const firestoreTimestamp = Timestamp.fromDate(dateObj);
    smjer.datumPokretanja = firestoreTimestamp;
    try {
        const skupKlubova = collection(getFirebaseDB(), PrefixStorage.KLUBOVI);
        const docRef = await addDoc(skupKlubova, klub);
        
        return {
            success: true,
            id: docRef.id
        };
    } catch (e) {
        console.error("Greška kod dodavanja: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}


async function getBySifra(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.KLUBOVI, sifra);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const d = data.datumPokretanja ? data.datumPokretanja.toDate() : new Date();
            const isoDatum = d.toISOString();
          
            return {
                success: true,
                data: {
                    sifra: docSnap.id,
                    ...data,
                    datumPokretanja: isoDatum
                }
            };
        } else {
            return { 
                success: false, 
                message: "Klub s tom šifrom ne postoji u bazi." 
            };
        }
    } catch (e) {
        console.error("Greška kod dohvaćanja po šifri: ", e);
        return { 
            success: false, 
            message: e.message 
        };
    }
}


async function promijeni(sifra, klub) {
    try {
        const dateObj = new Date(klub.datumPokretanja);
        const firestoreTimestamp = Timestamp.fromDate(dateObj);
        klub.datumPokretanja = firestoreTimestamp;
        const docRef = doc(getFirebaseDB(), PrefixStorage.KLUBOVI, sifra);
        await updateDoc(docRef, klub);

        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene: ", e);
        return { success: false, message: e.message };
    }
}


async function obrisi(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.KLUBOVI, sifra);
        await deleteDoc(docRef);
        return {
            success: true,
            message: "Uspješno obrisano"
        };
    } catch (e) {
        console.error("Greška kod brisanja: ", e);
        return {
            success: false,
            message: e.message
        };
    }
}

export default {
    get,
    dodaj,
    promijeni,
    getBySifra,
    obrisi
}