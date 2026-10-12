


import {DATA_SOURCE } from "../../constants"
import KlubServiceLocalStorage from "./KlubServiceLocalStorage"
import KlubServiceMemorija from "./KlubServiceMemorija"


let Servis = null


switch(DATA_SOURCE){
    case 'memorija':
        Servis = KlubServiceMemorija
        break
        case 'localStorage':
            Servis = KlubServiceLocalStorage
            break
            default:
                Servis = null
}


const PrazanServis = {

     get: async () => ({data: []}),
     getBySifra: async (sifra) => ({data: {}}),
     dodaj: async (klub) => {console.error('Servis nije implementiran')},
     promijeni: async(sifra, klub) => {console.error('Servis nije implementiran')},
      dodaj: async (klub) => {console.error('Servis nije implementiran')},
    promijeni: async (sifra, klub) => {console.error('Servis nije implementiran')},
     obrisi: async (sifra) => {console.error('Servis nije implementiran')}

}

const AktivniServis = Servis || PrazanServis
    


export default {
   
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (klub) => AktivniServis.dodaj(klub),
    promijeni: (sifra,klub) => AktivniServis.promijeni(sifra,klub),
     dodaj: (klub) => AktivniServis.dodaj(klub),
    promijeni: (sifra,klub) => AktivniServis.promijeni(sifra,klub),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
}