

import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import IgracService from "../../services/igraci/IgracService";


export default function IgracNovi() {

    const navigate = useNavigate()

    async function dodaj(igrac){
        await IgracService.dodaj(igrac).then(()=>{
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
                Dodavanje novog igraca
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required />
                </Form.Group>

                <Form.Group controlId="trajanje">
                    <Form.Label>Trajanje</Form.Label>
                    <Form.Control type="number" name="trajanje" step={1} />
                </Form.Group>

                <Form.Group controlId="cijena">
                    <Form.Label>Cijena</Form.Label>
                    <Form.Control type="number" name="cijena" step={0.01} />
                </Form.Group>

                <Form.Group controlId="datumPokretanja">
                    <Form.Label>Datum pokretanja</Form.Label>
                    <Form.Control type="date" name="datumPokretanja" />
                </Form.Group>

                <Form.Group controlId="aktivan" className="mt-3">
                    <Form.Check label="Aktivan" name="aktivan" />
                </Form.Group>


                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.SMJEROVI}
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