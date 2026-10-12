
import { klubovi } from "./KlubPodaci";

async function get() {
    return { data: [...klubovi] }
}

async function getBySifra(sifra) {
    return { data: klubovi.find(s => s.sifra === parseInt(sifra)) }

}



async function dodaj(klub) {
    if (klubovi.length === 0) {
        klub.sifra = 1
    } else {
        klub.sifra = klubovi[klubovi.length - 1].sifra + 1
    }
    klubovi.push(klub)
}

async function obrisi(sifra){
    const index = nadiIndex(sifra)
    klubovi.splice(index,1)
}
  function nadiIndex(sifra){
    return klubovi.findIndex(s => s.sifra === parseInt(sifra))
    
  }
  async function promijeni(sifra, klub){
    const index = nadiIndex(sifra)
    klubovi[index] = {...klubovi[index], ...klub}
  }
    

    


export default {
    get,
    getBySifra,
    dodaj,
    promijeni,
    obrisi
}