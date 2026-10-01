import { Link, useNavigate, useParams } from "react-router-dom" 
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row } from "react-bootstrap";
import IgracService from "../../services/igraci/IgracService"
import { useEffect, useState } from "react";



export default function IgracPregled() {

    const navigate = useNavigate()
    const parmas = useParams()
    const [igrac, setIgrac] = useState({})
    const [aktivan, setAktivan] = useState(false)

   async function ucitajIgraca(){
         await IgracService.getBySifra(parmas.sifra).then((odgovor)=>{
            const s = odgovor.data
            s.datumPokretanja = s.datumPokretanja.substring(0,10)
            setIgrac(s)
            setAktivan(s.aktivan)
         })
   }
    
   


    useEffect(() =>{
        
        ucitajIgraca()
    }, [])


    async function dodaj(igraca){
        await IgracService.dodaj(igraca).then(()=>{
            navigate(RouteNames.IGRACI)
        })
    }

    
     function obradiSubmit(e){ // e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        dodaj({
            naziv: podaci.get('naziv'),
            trajanje: parseInt(podaci.get('trajanje')),
            cijena: parseFloat(podaci.get('cijena')),
            datumPokretanja: new Date(podaci.get('datumPokretanja')).toISOString(),
            aktivan: podaci.get('aktivan') === 'on'
        })
    }    
    


       return (
        <>
            <h3>
                Promjena igraca
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required 
                    defaultValue={igrac.naziv}/>
                </Form.Group>

                <Form.Group controlId="trajanje">
                    <Form.Label>Trajanje</Form.Label>
                    <Form.Control type="number" name="trajanje" step={1} 
                    defaultValue={igrac.trajanje}/>
                </Form.Group>

                <Form.Group controlId="cijena">
                    <Form.Label>Cijena</Form.Label>
                    <Form.Control type="number" name="cijena" step={0.01} 
                    defaultValue={igrac.cijena}/>
                </Form.Group>

                <Form.Group controlId="datumPokretanja">
                    <Form.Label>Datum pokretanja</Form.Label>
                    <Form.Control type="date" name="datumPokretanja" 
                    defaultValue={igrac.datumPokretanja}/>
                </Form.Group>

                <Form.Group controlId="aktivan" className="mt-3">
                    <Form.Check label="Aktivan" name="aktivan" 
                    checked={aktivan}
                    onChange={(e)=>{setAktivan(e.target.checked)}}/>
                </Form.Group>


                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.IGRACI}
                        className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj
                        </Button>
                    </Col>
                </Row>
            </Form>


        </>
    )
}
   