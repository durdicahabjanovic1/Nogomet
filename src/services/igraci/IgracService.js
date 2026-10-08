


import {DATA_SOURCE } from "../../constants"
import IgracServiceLocalStorage from "./IgracServiceLoccalStorage"
import IgracServiceMemorija from "./IgracServiceMemorija"


let Servis = null


switch(DATA_SOURCE){
    case 'memorija':
        Servis = IgracServiceMemorija
        break
        case 'localStorage':
            Servis = IgracServiceLocalStorage
            break
            default:
                Servis = null
}


const PrazanServis = {

     get: async () => ({data: []}),
     getBySifra: async (sifra) => ({data: {}}),
     dodaj: async (igrac) => {console.error('Servis nije implementiran')},
     promijeni: async(sifra, igrac) => {console.error('Servis nije implementiran')},
     obrisi: async (sifra) => {console.error('Servis nije implementiran')}

}

const AktivniServis = Servis || PrazanServis
    


export default {
   
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (igrac) => AktivniServis.dodaj(igrac),
    promijeni: (sifra,igrac) => AktivniServis.promijeni(sifra,igrac),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
}