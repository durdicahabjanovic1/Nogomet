
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

    igraci.push(smjer)
    spremiUStorage(igraci)
}



async function promijeni(sifra, smjer){
    const igraci = dohvatiSveIzStorage()
    const index = igraci.findIndex(s => s.sifra === parseInt(sifra))
    igraci[index] = {...igraci[index], ...smjer}
    spremiUStorage(igraci)
}



async function obrisi(sifra){
    let igraci = dohvatiSveIzStorage()
    igraci = igraci.filter(s => s.sifra !== parseInt(sifra))
    spremiUStorage(igraci)
}



export default{
    get,
    getBySifra,
    dodaj,
    promijeni,
    obrisi
}
