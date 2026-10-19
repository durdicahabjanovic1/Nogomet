

import { Link, useNavigate, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, From, Row } from "react-bootstrap";
import KlubService from "../../services/klub/KlubService";



export default function KlubNovi() {
    
    const navigate = useNavigate()

    async function dodaj (klub) {
        await KlubService.dodaj(klub).then(()=> {
            navigate(RouteNames.KLUBOVI)
        })
        
    }

    function obradiSubmit(e) { // e je event}
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
            
        dodaj({
            sifra: podaci.get('sifra'),
            naziv: podaci.get('naziv'),
            mjesto: podaci.get('mjesto')

        })
}

return (
    <>

    <h3>
        Dodavanje novog kluba
    </h3>
    <From onSubmit={obradiSubmit}>

   


        <From.Grop controlId="sifra">
            <Form.Label>SIFRA</Form.Label>
            <From.Control type="number" name="sifra" required />
            </From.Grop>

             <From.Grop controlId="naziv">
            <Form.Label>Naziv</Form.Label>
            <From.Control type="text" name="naziv" required />
            </From.Grop>

             <From.Grop controlId="mjesto">
            <Form.Label>Mjesto</Form.Label>
            <From.Control type="text" name="mjesto" required />
            </From.Grop>

           <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.KLUBOVI}
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
                 </From>
            

        </>
    )
} 