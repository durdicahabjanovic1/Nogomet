import { igraci } from "./IgracPodaci";

async function get() {
    return { data: [...igraci] }
}

async function dodaj(igrac) {
    if (igraci.length === 0) {
        igrac.sifra = 1
    } else {
        igrac.sifra = igraci[igraci.length - 1].sifra + 1
    }
    igraci.push(igrac)
}

export default {
    get,

    dodaj
}