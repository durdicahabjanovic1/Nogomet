

import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import KlubService from "../../services/klubovi/KlubService";


export default function KlubNovi() {

    const navigate = useNavigate()

    async function dodaj(klub) {
        await KlubService.dodaj(klub).then(() => {
            navigate(RouteNames.KLUBOVI)
        })
    }

    function obradiSubmit(e) { // e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        dodaj({
            naziv: podaci.get('naziv'),
            mjesto: podaci.get('mjesto'),



        })
    }


    return (
        <>
            <h3>
                Dodavanje novog kluba
            </h3>

            <Form onSubmit={obradiSubmit}>

                 <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" />
                </Form.Group>
              

                <Form.Group controlId="mjesto">
                    <Form.Label>Mjesto</Form.Label>
                    <Form.Control type="text" name="mjesto" />
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group controlId="ime">
                            <Form.Label>Ime</Form.Label>
                            <Form.Control type="text" name="ime" required />
                        </Form.Group>
                    </Col>
                     <Col>

                <Form.Group controlId="prezime">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" name="prezime" required />
                </Form.Group>
                </Col>
                </Row>
                <Row>
                    <Col>
                <Form.Group controlId="brojDresa">
                    <Form.Label>brojDresa</Form.Label>
                    <Form.Control type="text" name="brojDresa" />
                </Form.Group>
                </Col>
                <Col>
                 <Form.Group controlId="brojKopacki">
                            <Form.Label>Broj kopački</Form.Label>
                            <Form.Control type="number" name="brojKopacki" />
                        </Form.Group>
                </Col>
                </Row>
                <Row>
                    <Col>
                     <Form.Group controlId="pozicija">
                            <Form.Label>Pozicija</Form.Label>
                            <Form.Control type="text" name="pozicija" />
                        </Form.Group>
                    </Col>
                    <Col>
                     <Form.Group controlId="datumRodenja">
                            <Form.Label>Datum rođenja</Form.Label>
                            <Form.Control type="date" name="datumRodenja" />
                        </Form.Group>
                      
                    </Col>
                </Row>
                 <Form.Group controlId="brojRegistracije">
                            <Form.Label>Broj registracije</Form.Label>
                            <Form.Control type="text" name="brojRegistracije" />
                        </Form.Group>










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
            </Form>


        </>
    )
}