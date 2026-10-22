import { useEffect, useState } from "react"
import IgracService from "../../services/igraci/IgracService"
import { Badge, Button, Table } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate  } from "react-router-dom"
import KlubService from "../../services/klubovi/KlubService"


export default function IgracPregled() {

    const [igraci, setIgraci] = useState([])
    const [klubovi, setKlubovi] = useState([])

    const navigate = useNavigate()

    async function ucitajIgrace() {
        await IgracService.get().then((odgovor) => {
            // console.table(odgovor.data)
           setIgraci(odgovor.data)
        })
    }
    async function ucitajKlubove() {
        await KlubService.get().then((o)=> {
            setKlubovi(o.data)
        })
    }

    useEffect(() => {
        ucitajKlubove()
        ucitajIgrace()
    }, [])


   

    async function obrisi(sifra){
        if(!confirm('Sigurno obrisati?')){
            return
        }
        await IgracService.obrisi(sifra)
        ucitajIgrace()
    }

    function dohvatiNazivKluba(sifraKluba) {
        const klub = klubovi.find(s => s.sifra === sifraKluba)
        return klub.naziv
    }

     

    
        
    

    return (
        <>

            <Link to ={RouteNames.IGRACI_DODAJ}
                className="btn btn-success w-100 my-3">

                Dodavanje novog igraca
            </Link >
            <Table hover striped bordered>

                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Klub</th>
                        <th>Broj dresa</th>
                        <th>Broj kopačkih</th>
                        <th>Pozicija</th>
                        <th>Datum rođenja</th>
                        <th>Broj registracije</th>
                        <th>
                            Akcija 
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {igraci && igraci.map((igrac) => (
                        <tr key={igrac.sifra}>
                            <td>
                                {igrac.naziv}
                            
                            </td>
                            <td>
                                {dohvatiNazivKluba(igrac.klub)}
                            </td>
                            <td>
                                <Button onClick={() => {navigate(`/igraci/${igrac.sifra}`)}}>
                                    Promjena

                                </Button>
                                 &nbsp;&nbsp;
                                    <Button variant="danger" onClick={() => obrisi(igrac.sifra)}>
                                        Obriši
                                    </Button>
                                </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            Ukupno igraca: &nbsp;
            <Badge pill bg="success">
                {igraci && igraci.length}
            </Badge>

        </>
    )
}

                           