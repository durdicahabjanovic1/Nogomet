
const STORAGE_KEY='igraci'

function dohvatiSveIzStorage(){
    const podaci = localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci) : []
}

function spremiUStorage(podaci){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get(){
    const igraci = dohvatiSveIzStorage()
    return {data: [...igraci]}
}

async function getBySifra(sifra){
    const igraci = dohvatiSveIzStorage()
    return {data: igraci.find(s => s.sifra === parseInt(sifra))}
}


async function dodaj(igrac){
    const igraci = dohvatiSveIzStorage()
    if(igraci.length === 0){
        igrac.sifra = 1
    }else{
        const maxSifra = Math.max(...igraci.map(s => s.sifra))
        igrac.sifra = maxSifra + 1
    }

    igraci.push(igrac)
    spremiUStorage(igraci)
    return igrac
}



async function promijeni(sifra, igrac){
    const igraci = dohvatiSveIzStorage()
    const index = igraci.findIndex(s => s.sifra === parseInt(sifra))
    igraci[index] = {...igraci[index], ...igrac}
    spremiUStorage(igraci)
}



async function obrisi(sifra){
    let igraci = dohvatiSveIzStorage()
    igraci = igraci.filter(s => s.sifra !== parseInt(sifra))
    spremiUStorage(igraci)
}

// Straničenje - dohvati stranicu polaznika
async function dohvatiStranicu(stranica = 1, velicinaStranice = 8) {
    const igraci = dohvatiSveIzStorage();
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



export default{
    get,
    getBySifra,
    dodaj,
    promijeni,
    obrisi,
    dohvatiStranicu
}
