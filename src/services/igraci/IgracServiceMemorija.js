
import { igraci } from "./IgracPodaci";

async function get() {
    return { data: [...igraci] }
}

async function getBySifra(sifra) {
    return { data: igraci.find(s => s.sifra === parseInt(sifra)) }

}



async function dodaj(igrac) {
    if (igraci.length === 0) {
        igrac.sifra = 1
    } else {
        igrac.sifra = igraci[igraci.length - 1].sifra + 1
    }
    igraci.push(igrac)
    return igrac
}

async function obrisi(sifra) {
    const index = nadiIndex(sifra)
    igraci.splice(index, 1)
}
function nadiIndex(sifra) {
    return igraci.findIndex(s => s.sifra === parseInt(sifra))

}
async function promijeni(sifra, igrac) {
    const index = nadiIndex(sifra)
    igraci[index] = { ...igraci[index], ...igrac }
}


// Straničenje - dohvati stranicu polaznika
async function dohvatiStranicu(stranica = 1, velicinaStranice = 8) {
    async function dohvatiStranicu(stranica = 1, velicinaStranice = 8, uvjetPretraživanja = '') {

        let filtriraniIgraci = [...igraci];

        if (uvjetPretraživanja && uvjetPretraživanja.trim() !== '') {
            const loweruvjetPretrazivanja = uvjetPretraživanja.toLowerCase().trim();
            filtriraniIgraci = filtriraniIgraci.filter(igrac => {
                const ime = (igrac.ime || '').toLowerCase();
                const prezime = (igrac.prezime || '').toLowerCase();
                const brojDreasa = (igrac.brojDresa || '').toLowerCase();
                const brojKopackih = (igrac.brojKopackih || '').toLowerCase();
                const pozicija = (igrac.pozicija || '').toLowerCase();
                const datumRodenja = (igrac.datumRodenja || '').toLowerCase();
                const brojRegistracije = (igrac.brojRegistracije || '').toLowerCase();



                return ime.includes(loweruvjetPretrazivanja) ||
                    prezime.includes(loweruvjetPretrazivanja) ||
                    brojDreasa.includes(loweruvjetPretrazivanja) ||
                    brojKopackih.includes(loweruvjetPretrazivanja) ||
                    pozicija.includes(loweruvjetPretrazivanja) ||
                    datumRodenja.includes(loweruvjetPretrazivanja) ||
                    brojRegistracije.includes(loweruvjetPretrazivanja);
            });

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
    }



    export default {
        get,
        getBySifra,
        dodaj,
        promijeni,
        obrisi,
        dohvatiStranicu
    }