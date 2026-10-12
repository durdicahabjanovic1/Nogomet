

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
                    <Form.Control type="text" name="naziv" required />
                </Form.Group>

                <Form.Group controlId="mjesto">
                    <Form.Label>Mjesto</Form.Label>
                    <Form.Control type="text" name="mjesto" />
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