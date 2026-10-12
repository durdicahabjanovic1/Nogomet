
const STORAGE_KEY='klubovi'

function dohvatiSveIzStorage(){
    const podaci = localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci) : []
}

function spremiUStorage(podaci){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get(){
    const klubovi = dohvatiSveIzStorage()
    return {data: [...klubovi]}
}

async function getBySifra(sifra){
    const klubovi = dohvatiSveIzStorage()
    return {data: klubovi.find(s => s.sifra === parseInt(sifra))}
}


async function dodaj(klub){
    const klubovi = dohvatiSveIzStorage()
    if(klubovi.length === 0){
        klub.sifra = 1
    }else{
        const maxSifra = Math.max(...klubovi.map(s => s.sifra))
        klub.sifra = maxSifra + 1
    }

    klubovi.push(smjer)
    spremiUStorage(klubovi)
}



async function promijeni(sifra, smjer){
    const klubovi = dohvatiSveIzStorage()
    const index = klubovi.findIndex(s => s.sifra === parseInt(sifra))
    klubovi[index] = {...klubovi[index], ...smjer}
    spremiUStorage(klubovi)
}



async function obrisi(sifra){
    let klubovi = dohvatiSveIzStorage()
    klubovi = klubovi.filter(s => s.sifra !== parseInt(sifra))
    spremiUStorage(klubovi)
}



export default{
    get,
    getBySifra,
    dodaj,
    promijeni,
    obrisi
}
