
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import IgracService from "../../services/igraci/IgracService";
import { useEffect, useState } from "react";
import KlubService from "../../services/klubovi/KlubService";


export default function IgracNovi() {

    const navigate = useNavigate()

    const [klubovi, setKlubovi] = useState([])

    async function ucitajKlubove() {
        await KlubService.get().then((res) => {
            setKlubovi(res.data)
        })
    }

    useEffect(() => {
        ucitajKlubove()
    }, [])

    async function dodaj(igrac) {
        await IgracService.dodaj(igrac).then(() => {
            navigate(RouteNames.IGRACI)
        })
    }

    function obradiSubmite(e) { // e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        dodaj({
            naziv: podaci.get('naziv'),
            klub: podaci.get('klub')
        })
    }


     return (
        <>
            <h3>
                Dodavanje novog igrača
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required />
                </Form.Group>

                <Form.Group controlId="klub">
                    <Form.Label>Klub</Form.Label>
                    <Form.Select name="klub" required>
                        <option value="" key={0}>Obavezan odabir kluba</option>
                        {klubovi && klubovi.map((s)=>(
                             <option value={s.sifra} key={s.sifra}>
                                {s.naziv} 
                             </option>
                        ))}
                    </Form.Select>
                </Form.Group>

        



                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.GRUPE}
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