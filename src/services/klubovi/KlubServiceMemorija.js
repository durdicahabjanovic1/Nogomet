
import IgracService from "../igraci/IgracService";
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
    klub.igraci.map(async (igracSifra) => {
        await makniSDrugihKlubova(igracSifra, klub.sifra)
    })
    klubovi.push(klub)
}

async function obrisi(sifra) {
    const index = nadiIndex(sifra)
    klubovi.splice(index, 1)
}
function nadiIndex(sifra) {
    return klubovi.findIndex(s => s.sifra === parseInt(sifra))

}
async function promijeni(sifra, klub) {
    const index = nadiIndex(sifra)
    klub.igraci.map(async (igracSifra) => {
        await makniSDrugihKlubova(igracSifra, sifra)
    })
    klubovi[index] = { ...klubovi[index], ...klub }
}


async function makniSDrugihKlubova(sifraIgraca, sifraKluba) {
    [...klubovi]
        .filter((k) => k.sifra != sifraKluba)
        .map((klub) => {
            klub.igraci = klub.igraci.filter(i => i.sifra != sifraIgraca)
        })
    const igrac = await IgracService.getBySifra(sifraIgraca)
    igrac.data.klub = parseInt(sifraKluba)
    await IgracService.promijeni(sifraIgraca, igrac.data)
}



export default {
    get,
    getBySifra,
    dodaj,
    promijeni,
    obrisi
}