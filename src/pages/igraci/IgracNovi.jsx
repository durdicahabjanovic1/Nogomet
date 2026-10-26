

import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, CardBody, Col, Form, FormGroup, Row } from "react-bootstrap";
import IgracService from "../../services/igraci/IgracService";
import { useEffect, useState } from "react";
import KlubService from "../../services/klubovi/KlubService";

import { useEffect, useState } from "react";
import { Form, Button, Row, Col, Container, Card, Table } from "react-bootstrap"
import { RouteNames } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import KlubService from "../../services/klubovi/KlubService";
import IgracService from "../../services/igraci/IgracService";



export default function IgracNovi() {

    const navigate = useNavigate()

    const [klubovi, setKlubovi] = useState([])
    const [igraci, setIgraci] = useState([])
    const [odabraniIgraci, setOdabraniIgraci] = useState([])
    const [pretragaIgraca, setPretragaIgraca] = useState('')
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)

    useEffect(() => {
        ucitajKlubove()
        ucitajIgrace()
    }, [])


    async function ucitajKlubove() {
        await KlubService.get().then((res) => {
            setKlubovi(res.data)
        })
        async function ucitajKlubove() {
            await KlubService.get().then((odgovor) => {
                setKlubovi(odgovor.data)
            })
        }
    }

    useEffect(() => {
        ucitajKlubove()
    }, [])
    async function ucitajIgrace() {
        await IgracService.get().then((odgovor) => {
            setIgraci(odgovor.data)
        })
    }

    function dodajIgraca(igrac) {
        if (!odabraniIgraci.find(p => p.sifra === igrac.sifra)) {
            setOdabraniIgraci([...odabraniIgraci, igrac])
        }
        setPretragaIgraca('')
        setPrikaziAutocomplete(false)
        setOdabraniIndex(-1)
    }

    function ukloniIgraca(sifra) {
        setOdabraniIgraci(odabraniIgraci.filter(p => p.sifra !== sifra))
    }

    function filtrirajIgraci() {
        if (!pretragaIgraca) return []
        return igraci.filter(p =>
            !odabraniIgraci.find(op => op.sifra === p.sifra) &&
            (p.ime.toLowerCase().includes(pretragaIgraca.toLowerCase()) ||
                p.prezime.toLowerCase().includes(pretragaIgraca.toLowerCase()))
        )
    }

    function handleKeyDown(e) {
        const filtriraniIgraci = filtrirajIgraci()

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOdabraniIndex(prev => {
                if (prev + 1 === filtriraniIgraci.length) {
                    return 0
                }
                return prev < filtriraniIgraci.length - 1 ? prev + 1 : prev
            }

            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setOdabraniIndex(prev => {
                if (prev === 0) {
                    return filtriraniIgraci.length - 1
                }
                return prev > 0 ? prev - 1 : 0
            })
        } else if (e.key === 'Enter' && odabraniIndex >= 0 && filtriraniIgraci.length > 0) {
            e.preventDefault()
            dodajIgraca(filtriraniIgraci[odabraniIndex])
        } else if (e.key === 'Escape') {
            setPrikaziAutocomplete(false)
            setOdabraniIndex(-1)
        }
    }

    async function dodaj(igrac) {
        await IgracService.dodaj(igrac).then(() => {
            navigate(RouteNames.IGRACI)
        })
    }


    function obradiSubmit(e) { // e je event
        e.preventDefault() // nemoj odraditi submit
        function odradiSubmit(e) {
            e.preventDefault()
        }
        const podaci = new FormData(e.target)

        if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
            alert("Naziv je obavezan i ne smije sadržavati samo razmake!");
            return;
        }

        if (podaci.get('naziv').trim().length < 3) {
            alert("Naziv igraca mora imati najmanje 3 znaka!");
            return;
        }

        if (!podaci.get('klub') || podaci.get('klub') === "") {
            alert("Morate odabrati klub!");
            return;
        }

        const odabraniKlub = parseInt(podaci.get('klub'));
        if (isNaN(odabraniKlub) || odabraniKlub <= 0) {
            alert("Odabrani klub nije valjan!");
            return;
        }
        dodaj({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            klub: parseInt(podaci.get('klub')),
            klub: odabraniKlub,
            igraci: odabraniIgraci.map(p => p.sifra)
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
                <Container className="mt-4">
                    <Row>
                        {/* Lijeva strana - Podaci o igracu */}
                        <Col md={6}>
                            <Card className="=" shadow-sm">
                            <Card.Body>
                                <Card.Title className="=" mb-4">Unos novog igraca></Card.Title>

                            <Form on Submit={obradiSubmit}>
                                {/*Naziv*/}
                                <Form.Group controlId="naziv" className="mb-3">
                                    <Form.Label className="fw-bold">Naziv</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="naziv"

                                        placeholder="Unesite naziv igraca"
                                        required
                                    />
                                </Form.Group>




                                <Form.Group controlId="ime">
                                    <Form.Label>Ime</Form.Label>
                                    <Form.Control type="text" name="ime" required />
                                </Form.Group>

                                <Form.Group controlId="prezime">
                                    <Form.Label>Prezime</Form.Label>
                                    <Form.Control type="text" name="prezime" required />
                                </Form.Group>
                                {/* Klub */}
                                <Form.Group controlId="klub" className="mb-3">
                                    <Form.Label className="fw-bold">Klub</Form.Label>
                                    <Form.Select name="klub" required>
                                        <option value="">Odaberite klub</option>
                                        {klubovi && klubovi.map((klub) => (
                                            <option key={klub.sifra} value={klub.sifra}>
                                                {klub.naziv}
                                            </option>

                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Form.Group controlId="klub">
                        <Form.Label>Klub</Form.Label>
                        <Form.Select name="klub" required >
                            <option value="" key={0}>Obavezan odabir kluba</option>
                            {klubovi && klubovi.map((s) => (
                                <option value={s.sifra} key={s.sifra}>
                                    {s.naziv}
                                </option>

                            ))}
                        </Form.Select>
                    </Form.Group>
                    {/*Desna strana - Igraci */}
                    <Col md={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-4">Igraci</Card.Title>

                                {/* Autocomplete pretraga*/}
                                <FormGroup className="mb -3 position-relative">
                                    <Form.Label className="fw-bold">Dodaj igraca</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Pretraži igrača..."
                                        value={pretragaIgraca}
                                        onChange={(e) => {
                                            setPretragaIgraca(e.target.value)
                                            setPrikaziAutocomplete(e.target.value.length > 0)
                                            setOdabraniIndex(-1)
                                        }}
                                        onFocus={() => setPrikaziAutocomplete(pretragaIgraca.length > 0)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    {prikaziAutocomplete && filtrirajIgrace().length > 0 && (
                                        <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                            {filtrirajIgrace().map((igrac, index) => (
                                                <div
                                                    key={igrac.sifra}
                                                    className="p-2 cursor-pointer"
                                                    style={{
                                                        cursor: 'pointer',
                                                        backgroundColor: index === odabraniIndex ? '#007bff' : 'white',
                                                        color: index === odabraniIndex ? 'white' : 'black'
                                                    }}
                                                    onClick={() => dodajIgraca(igrac)}
                                                    onMouseEnter={(e) => {
                                                        setOdabraniIndex(index)
                                                    }}

                                                    {igrac.ime} {igrac.prezime} 

                                                    </div>
                                    ))}
                                </div>
                                        )}
                            </Form.Group>

                            {/* Tablica odabranih igraca */}
                            {odabraniIgraci.length > 0 && (
                                <div style={{ overflow: 'auto', maxHeight: '250px' }}>
                                    <Table striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                <th>Ime i prezime</th>
                                                <th style={{ width: '80px' }}>Akcija</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {odabraniIgraci.map(polaznik => (
                                                <tr key={igrac.sifra}>
                                                    <td>{igrac.ime} {igrac.prezime}</td>
                                                    <td>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => ukloniIgraca(igrac.sifra)}
                                                        >
                                                            Obriši
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>

                            )}
                            {odabraniIgraci.length === 0 && (
                                <p className="text-muted">Nema odabranih igraca</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


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
                        <hr className="my-4" />
                        <div className="d-grid gap -2 d -md-flex justify-content-md-end">
                            <Link to={RouteNames.IGRACI} className="btn btn-danger px-4">

                                Odustani
                            </Link>
                        </Col>
                        <Col>
                            <Button type="submit" variant="success">
                                Dodaj
                                Dodaj novog igraca
                            </Button>
                        </Col>
                    </Row>

                      </div>

                      </Container>
                </Form>


            </>
            )
        }