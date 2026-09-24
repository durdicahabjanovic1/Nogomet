import { useEffect, useState } from "react"
import IgracService from "../../services/igraci/IgracService"
import { Badge, Table } from "react-bootstrap"


export default function IgracPregled(){

    const [igraci, setIgraci] = useState()

    useEffect(()=>{
        ucitajIgrace()
    }, [])

    async function ucitajIgrace(){
        await IgracService.get().then((odgovor)=>{
            setIgraci(odgovor.data)
        })
    }

    return (
        <>
            <Table>
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
                    {igraci && igraci.map((igrac)=>(
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
            Ukupno &nbsp;
            <Badge pill bg="success">
                {igraci && igraci.length}
            </Badge>
            &nbsp; igrača
        </>
    )
}