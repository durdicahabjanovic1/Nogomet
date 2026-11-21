

import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc, query, orderBy, limit, startAfter, where } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";


// 1/4 Read - dohvati sve
async function get() {
    try {
        const skupIgraca = collection(getFirebaseDB(), PrefixStorage.IGRACI);
        const snapshot = await getDocs(skupIgraca);
        const data = snapshot.docs.map(doc => ({
            sifra: doc.id,
            ...doc.data()
        }));
        return { success: true, data: data };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// Dohvati jedan po šifri
async function getBySifra(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.IGRACI, sifra);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { sifra: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, message: "Igrac nije pronađen" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 2/4 Create - dodaj novi
async function dodaj(igrac) {
    try {
        const skupIgraca = collection(getFirebaseDB(), PrefixStorage.IGRACI);
        const docRef = await addDoc(skupIgraca, igrac);
        return { success: true, data: { sifra: docRef.id, ...igrac } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 3/4 Update - promjeni postojeći
async function promijeni(sifra, igrac) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.IGRACI, sifra);
        await updateDoc(docRef, igrac);
        return { success: true, data: { sifra, ...igrac } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 4/4 Delete - obriši
async function obrisi(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.IGRACI, sifra);
        await deleteDoc(docRef);
        return { success: true, message: 'Uspješno obrisano' };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

/**
 * Straničenje - dohvati stranicu igrača
 * NAPOMENA: Firestore ne podržava "offset" na način kao SQL ili JS slice.
 * Ovdje koristimo pojednostavljenu verziju koja dohvaća podatke i filtrira ih.
 */
async function dohvatiStranicu(stranica = 1, velicinaStranice = 8, uvjetPretrazivanja = '') {
    try {
        const skupIgraca = collection(getFirebaseDB(), PrefixStorage.IGRACI);
        let q = query(skupIgraca, orderBy("prezime"));

        const snapshot = await getDocs(q);
        let igraci = snapshot.docs.map(doc => ({
            sifra: doc.id,
            ...doc.data()
        }));
        // Filtriranje (budući da Firestore ne podržava kompleksni "OR" search na više polja s "includes")
        if (uvjetPretrazivanja && uvjetPretrazivanja.trim() !== '') {
            const lowerSearchTerm = uvjetPretrazivanja.toLowerCase().trim();
            igraci = igraci.filter(p =>
                (p.ime || '').toLowerCase().includes(lowerSearchTerm) ||
                (p.prezime || '').toLowerCase().includes(lowerSearchTerm) ||
                (p.brojDresa || '').toLowerCase().includes(lowerSearchTerm) ||
                (p.brojKopacki || '').toLowerCase().includes(lowerSearchTerm)
                    (p.pozicija || '').toLowerCase().includes(lowerSearchTerm)
                    (p.datumRodenja || '').toLowerCase().includes(lowerSearchTerm)
                    (p.brojRegistracije || '').toLowerCase().includes(lowerSearchTerm)
                    (p.klub || '').toLowerCase().includes(lowerSearchTerm)

            );
        }

        const pocetniIndeks = (stranica - 1) * velicinaStranice;
        const zavrsniIndeks = pocetniIndeks + velicinaStranice;
        const stranicenjePodaci = igraci.slice(pocetniIndeks, zavrsniIndeks);
        const ukupnoStavki = igraci.length;
        const ukupnoStranica = Math.ceil(ukupnoStavki / velicinaStranice);
        return {
            data: stranicenjePodaci,
            ukupnoStranica: ukupnoStranica,
            ukupnoStavki: ukupnoStavki
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja stranice igrača: ", e);
        return { success: false, message: e.message };
    }
}

export default {
    get,
    dodaj,
    getBySifra,
    promijeni,
    obrisi,
    dohvatiStranicu
};
