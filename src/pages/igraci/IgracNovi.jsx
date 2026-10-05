

import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import IgracService from "../../services/igraci/IgracService";


export default function IgracNovi() {

    const navigate = useNavigate()

    async function dodaj(igrac){
        await IgracService.promjeni(igrac).then(()=>{
            navigate(RouteNames.IGRACI)
        })
    }

    function obradiSubmit(e){ // e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        dodaj({
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
                Dodavanje novog igraca
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime" required />
                </Form.Group>

                <Form.Group controlId="prezime">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" name="prezime"  />
                </Form.Group>

                <Form.Group controlId="brojDresa">
                    <Form.Label>Broj dresa</Form.Label>
                    <Form.Control type="number" name="brojDresa" step={1} />
                </Form.Group>

                <Form.Group controlId="brojKopacki">
                    <Form.Label>Broj kopački</Form.Label>
                    <Form.Control type="number" name="brojKopacki" />
                </Form.Group>

                 <Form.Group controlId="pozicija">
                    <Form.Label>Pozicija</Form.Label>
                    <Form.Control type="text" name="pozicija" />
                </Form.Group>

                 <Form.Group controlId="datumRodenja">
                    <Form.Label>Datum rođenja</Form.Label>
                    <Form.Control type="date" name="datumRodenja" />
                </Form.Group>

            
                 <Form.Group controlId="brojRegistracije">
                    <Form.Label>Broj registracije</Form.Label>
                    <Form.Control type="text" name="brojRegistracije" />
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