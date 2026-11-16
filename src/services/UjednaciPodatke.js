import IgracService from "./igraci/IgracService";
import KlubService from "./klubovi/KlubService";


export default async function ujednaciPodatke(klubUlaz, igracUlaz) {
    
    // NE RADI MICANJE S STAROG KLUBA KOD PROMJENE KLUBA - dodavanje na klub
    
    
    // debugger
    // console.log('Klub ulaz')
    // console.log(klubUlaz)
    // console.log('Igrac ulaz')
    // console.log(igracUlaz)
    // console.log('*****************')
    let klub
    if(!klubUlaz?.sifra){
       // console.log('Nema kluba, dodajem')
        klub = await KlubService.dodaj(klubUlaz)
      //  console.log(klub)
    }else{
        klub = klubUlaz
    }

    let igrac
    if(!igracUlaz?.sifra){
      //  console.log('Nema igrača, dodajem')
        igrac = await IgracService.dodaj(igracUlaz)
       // console.log(igrac)
    }else{
        igrac = igracUlaz
    }

    //sa svih klubova koji nisu trenutni makni tog igrača
    const klubovi = await KlubService.get()
   // console.log('radim s objektima')
   // console.log(klub)
   // console.log(igrac)
  //  console.log('---------------')
 
    klubovi.data.map(async k => {
        if (k.igraci.find(i => i.sifra === igrac.sifra)) {
            const ostaliIgraci = k.igraci.filter(i => i !== igrac.sifra)
            k.igraci = ostaliIgraci
            await KlubService.promijeni(k.sifra, k)
        }
    })

    // na klub dodaj igrača
    klub.igraci.push(igrac.sifra)
    await KlubService.promijeni(klub.sifra, klub)

    //igraču postavi trenutni klub
    igrac.klub = klub.sifra
    await IgracService.promijeni(igrac.sifra, igrac)
    //console.log('Novi podaci')
  //  console.log(klub)
   // console.log(igrac)
}