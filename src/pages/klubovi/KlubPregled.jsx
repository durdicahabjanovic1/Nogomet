import { useEffect, useState } from "react"
import KlubService from "../../services/klubovi/KlubService"
import { Badge, Button, Table } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate  } from "react-router-dom"


export default function klubPregled() {

    const [klubovi, setklubovi] = useState([])

    const navigate = useNavigate()

    async function ucitajklubove() {
        await KlubService.get().then((odgovor) => {
            // console.table(odgovor.data)
           setklubovi(odgovor.data)
        })
    }


    useEffect(() => {
        //console.log('Došao na pregled kluba)
        ucitajklubove()
    }, [])

    async function obrisi(sifra){
        if(!confirm('Sigurno obrisati?')){
            return
        }
        await KlubService.obrisi(sifra)
        ucitajklubove()
    }

     

    
        
    

    return (
        <>

            <Link to ={RouteNames.KLUBOVI_DODAJ}
                className="btn btn-success w-100 my-3">

                Dodavanje novog kluba
            </Link >
            <Table hover striped bordered>

                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Mjesto</th>
                        <th>
                            Akcija 
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {klubovi && klubovi.map((klub) => (
                        <tr key={klub.sifra}>
                            <td>{klub.naziv}</td>
                            <td>{klub.mjesto}</td>
                            <td>
                                <Button onClick={()=>{navigate(`/klubovi/${klub.sifra}`)}}>
                                Promijeni

                                </Button>
                   
                                
                                &nbsp;&nbsp;

                                <Button variant="danger" onClick={()=>obrisi(klub.sifra)}>
                                    Obriši

                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            Ukupno
            <Badge pill bg="success">
                {klubovi && klubovi.length}
            </Badge>
            klubova
        </>
    )
}