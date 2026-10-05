import { useEffect, useState } from "react"
import IgracService from "../../services/igraci/IgracService"
import { Badge, Table } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate  } from "react-router-dom"


export default function IgracPregled() {

    const [igraci, setIgraci] = useState([])

    const navigate = useNavigate()

    async function ucitajIgrace() {
        await IgracService.get().then((odgovor) => {
            // console.table(odgovor.data)
           setIgraci(odgovor.data)
        })
    }


    useEffect(() => {
        //console.log('Došao na pregled igraca)
        ucitajIgrace()
    }, [])

     

    
        
    

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
                        <th>Broj dresa</th>
                        <th>Broj kopačkih</th>
                        <th>Pozicija</th>
                        <th>Datum rođenja</th>
                        <th>Broj registracije</th>
                    </tr>
                </thead>
                <tbody>
                    {igraci && igraci.map((igrac) => (
                        <tr key={igrac.sifra}>
                            <td>{igrac.ime}</td>
                            <td>{igrac.prezime}</td>
                            <td>{igrac.brojDresa}</td>
                            <td>{igrac.brojKopackih}</td>
                            <td>{igrac.pozicija}</td>
                            <td>{igrac.datumRodenja}</td>
                            <td>{igrac.brojRegistracije}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            Ukupno
            <Badge pill bg="success">
                {igraci && igraci.length}
            </Badge>
            igrača
        </>
    )
}