import { useEffect, useState } from "react"
import KlubService from "../../services/klubovi/KlubService"
import { Badge, Button, Table } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate  } from "react-router-dom"
import IgracService from "../../services/igraci/IgracService"
import { FaFilePdf } from "react-icons/fa"
import KlubPDFGenerator from "../../components/KlubPDFGenerator"


export default function klubPregled() {

    const [klubovi, setKlubovi] = useState([])
      const [sviIgraci, setSviIgraci] = useState([])
    const [tooltip, setTooltip] = useState({
        vidljivo: false,
        x: 0,
        y: 0,
        podaci: []
    })
    

    const navigate = useNavigate()

    async function ucitajKlubove() {
        await KlubService.get().then((odgovor) => {
            console.log(JSON.stringify(odgovor.data))
            // console.table(odgovor.data)
           setKlubovi(odgovor.data)
        })
    }


    useEffect(() => {
        //console.log('Došao na pregled kluba)
        ucitajKlubove()
    }, [])

    async function obrisi(sifra){
        if(!confirm('Sigurno obrisati?')){
            return
        }
        await KlubService.obrisi(sifra)
        ucitajKlubove()
    }


      async function generirajPDFZaKlub(klub) {
     

          const odgovorIgraci = await IgracService.get()

       
        const igraciKlubovi = odgovorIgraci.data.filter(p =>
            klub.igraci && klub.igraci.includes(p.sifra)
        )

       
        const generiraj = KlubPDFGenerator({
            klub,
            igraci: igraciKlubovi
        })
        await generiraj()
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
                            <td>
                              <FaFilePdf
                                    color="#cb72dd"
                                    style={{ cursor: 'hand' }}
                                    onClick={() => generirajPDFZaKlub(klub)} title="Generiraj PDF" />
                            
                            {klub.naziv}
                                <span title="Broj igraca"> ({klub.igraci.length}) </span>
                            </td>
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
            Ukupno klubova: &nbsp;
            <Badge pill bg="success">
                {klubovi && klubovi.length}
            </Badge>
            
        </>
    )
}