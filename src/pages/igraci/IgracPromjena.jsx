import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row } from "react-bootstrap";
import IgracService from "../../services/igraci/IgracService"
import { useEffect, useState } from "react";
import KlubService from "../../services/klubovi/KlubService"



export default function IgracPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [klubovi, setKlubovi] = useState([])
    const [igrac, setIgrac] = useState({})

    async function ucitajKlubove() {
        await KlubService.get().then((res) => {
            // console.log(res.data)
            setKlubovi(res.data)


        })
    }
    async function ucitajIgrac() {
        await IgracService.getBySifra(params.sifra).then((res) => {
            const s = res.data
            s.datumRodenja = s.datumRodenja.substring(0, 10)
            setIgrac(s)

        })
    }




    useEffect(() => {
        ucitajKlubove()
        ucitajIgrac()
    }, [])


    async function promijeni(igraca) {
        await IgracService.promijeni(params.sifra, igraca).then(() => {
            navigate(RouteNames.IGRACI)
        })
    }


    function obradiSubmit(e) { // e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        promijeni({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            klub: parseInt(podaci.get('klub')),
            brojDresa: parseInt(podaci.get('brojDresa')),
            brojKopackih: parseInt(podaci.get('brojKopacki')),
            pozicija: podaci.get('pozicija'),
            datumRodenja: new Date(podaci.get('datumRodenja')).toISOString(),
            brojRegistracije: podaci.get('brojRegistracije')
        })
    }



    return (
        <>
            <h3>
                Dodavanje novog igraca
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Row>
                    <Col>
                        <Form.Group controlId="ime">
                            <Form.Label>Ime</Form.Label>
                            <Form.Control type="text" name="ime" required
                                defaultValue={igrac.ime} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="prezime">
                            <Form.Label>Prezime</Form.Label>
                            <Form.Control type="text" name="prezime" required
                                defaultValue={igrac.prezime} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group controlId="klub">
                            <Form.Label>Klub</Form.Label>
                            <Form.Select name="klub" required
                                value={igrac.klub}
                                onChange={(e) => setIgrac({ ...igrac, klub: parseInt(e.target.value) })}>
                                <option value="" key={0}>Obavezan odabir kluba</option>
                                {klubovi && klubovi.map((s) => (
                                    <option value={s.sifra} key={s.sifra}>
                                        {s.naziv}
                                    </option>


                                ))}


                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="brojDresa">
                            <Form.Label>Broj dresa</Form.Label>
                            <Form.Control type="number" name="brojDresa" step={1}
                                defaultValue={igrac.brojDresa} />
                        </Form.Group>
                    </Col>
                </Row>


                <Row>
                    <Col>
                        <Form.Group controlId="brojKopacki">
                            <Form.Label>Broj kopački</Form.Label>
                            <Form.Control type="number" name="brojKopacki" 
                            defaultValue={igrac.brojKopackih}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="pozicija">
                            <Form.Label>Pozicija</Form.Label>
                            <Form.Control type="text" name="pozicija" 
                            defaultValue={igrac.pozicija}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="datumRodenja">
                            <Form.Label>Datum rođenja</Form.Label>
                            <Form.Control type="date" name="datumRodenja" 
                            defaultValue={igrac.datumRodenja}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="brojRegistracije">
                            <Form.Label>Broj registracije</Form.Label>
                            <Form.Control type="text" name="brojRegistracije" 
                            defaultValue={igrac.brojRegistracije}/>
                        </Form.Group>
                    </Col>
                </Row>












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
