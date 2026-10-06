import { Link, useNavigate, useParams } from "react-router-dom" 
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row } from "react-bootstrap";
import IgracService from "../../services/igraci/IgracService"
import { useEffect, useState } from "react";



export default function IgracPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [igrac, setIgrac] = useState({})

   async function ucitajIgraca(){
         await IgracService.getBySifra(params.sifra).then((odgovor)=>{
            const s = odgovor.data
            s.datumRodenja = s.datumRodenja.substring(0,10)
            setIgrac(s)
         })
   }
    
   


    useEffect(() =>{
        
        ucitajIgraca()
    }, [])


    async function promijeni(igraca){
        await IgracService.promijeni(params.sifra,igraca).then(()=>{
            navigate(RouteNames.IGRACI)
        })
    }

    
     function obradiSubmit(e){ // e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        promijeni({
                ime: podaci.get('ime'),
        prezime: podaci.get('prezime'),
        brojDresa: parseInt(podaci.get('brojDresa')),
        brojKopackih: parseInt(podaci.get('brojKopacki')),
        pozicija: podaci.get('pozicija'),
        datumRodenja: new Date(podaci.get('datumRodenja')).toISOString(),
        brojRegistracije: parseInt(podaci.get('brojRegistracije'))
        })
    }    
    


       return (
        <>
            <h3>
                Promjena igraca
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime" required 
                    defaultValue={igrac.ime}/>
                </Form.Group>

                <Form.Group controlId="prezime">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" name="prezime"  
                    defaultValue={igrac.prezime}/>
                </Form.Group>

                <Form.Group controlId="brojDresa">
                    <Form.Label>Broj dresa</Form.Label>
                    <Form.Control type="number" name="brojDresa" step={1} 
                    defaultValue={igrac.brojDresa}/>
                </Form.Group>

                <Form.Group controlId="brojKopacki">
                    <Form.Label>Broj kopački</Form.Label>
                    <Form.Control type="number" name="brojKopacki" 
                    defaultValue={igrac.brojKopackih}/>
                </Form.Group>

                 <Form.Group controlId="pozicija">
                    <Form.Label>Pozicija</Form.Label>
                    <Form.Control type="text" name="pozicija" 
                    defaultValue={igrac.pozicija}/>
                </Form.Group>

                 <Form.Group controlId="datumRodenja">
                    <Form.Label>Datum rođenja</Form.Label>
                    <Form.Control type="date" name="datumRodenja" 
                    defaultValue={igrac.datumRodenja}/>
                </Form.Group>

            
                 <Form.Group controlId="brojRegistracije">
                    <Form.Label>Broj registracije</Form.Label>
                    <Form.Control type="text" name="brojRegistracije" 
                    defaultValue={igrac.brojRegistracije}/>
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
                            Promijeni
                        </Button>
                    </Col>
                </Row>
            </Form>


        </>
    )
}
   