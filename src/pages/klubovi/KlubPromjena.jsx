import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import KlubService from "../../services/klubovi/KlubService";
import { useEffect, useState } from "react";
import IgracService from "../../services/igraci/IgracService";


export default function KlubPromjena(){

    const navigate = useNavigate()

    const params = useParams()

    const [klub, setKlub] = useState({})
    const [igraci, setIgraci] = useState([])
    const [odabraniIgraci, setOdabraniIgraci] = useState([])
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)

    useEffect(() =>{
        ucitajKlub()
        ucitajIgrace()
    }, [])

    useEffect(() => {
        if (klub.igraci && igraci.length > 0) {
            const odabrani = igraci.filter(p => klub.igraci.includes(p.sifra))
            setOdabraniIgraci(odabrani)
        }

    }, [klub, igraci])

    async function ucitajKlub() {
        await KlubService.getBySifra(params.sifra).then((odgovor) => {
            setKlub(odgovor.data)
        })
    }
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

    function filtrirajIgrace() {
        if (!pretragaIgraca) return []
        return igraci.filter(p =>
            !odabraniIgraci.find(op => op.sifra === p.sifra) &&
            (p.ime.toLowerCase().includes(pretragaIgraca.toLowerCase()) ||
                p.prezime.toLowerCase().icludes(pretragaIgraca.toLowerCase()))
        )

    }
    function handleKeyDown(e) {
        const filtriraniIgraci = filtrirajIgrace()

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
                if(prev === 0){
                    return filtriraniIgraci.length-1
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



useEffect(() => {
    ucitajKlub()
}, [])

async function promijeni(klub) {
    await KlubService.promijeni(params.sifra, klub).then(()=>{
        navigate(RouteNames.KLUBOVI)
    })
}

function obradiSubmit(e){
    e.preventDefault()
    const podaci = new FormData(e.target)

    if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
        alert("Naziv je obavezan i ne smije sadržavati samo razmake!");
        return;
    }

    if (podaci.get('naziv').trim().length < 3) {
        alert("Naziv kluba mora imati najmanje 3 znaka!");
        return;
    }

    if (!podaci.get('klub') || podaci.get('klub') === "") {
        alert("Morate odabrati klub!");
        return;
    }


    const odabraniKlub = parseInt(podaci.get('klub'));
    if (isNaN(odabraniKlub) || odabraniKlub <= 0) {
        alert("Odabrani klub nuje valjan!");
        return;
    }
    promijeni({
        naziv: podaci.get('naziv'),
        mjesto: podaci.get('mjesto'),
        igraci: odabraniIgraci.map(p => p.sifra)

    })
}


return (
    <>
        <h3>
            Promijeni klub
        </h3>

        <Form onSubmit={obradiSubmit}>
            <Container className="mt-4">
                <Row>
                    <Col md={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-4">Promjena kluba</Card.Title>

                                <Form.Group controlId="naziv" className="mb-3">
                                    <Form.Label className="fw-bold">Naziv</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="naziv"
                                        placeholder="Unesite naziv kluba"
                                        required
                                        defaultValue={klub.naziv}
                                    />
                                </Form.Group>

                                <Form.Group controlId="mjesto" className="mb-3">
                                    <Form.Label className="fw-bold">Mjesto</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="mjesto"
                                        placeholder="Unesite mjesto kluba"
                                        required
                                        defaultValue={klub.mjesto}
                                    />
                                </Form.Group>

                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-4">Igraci</Card.Title>

                                <Form.Group className="mb-3 position-relative">
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
                                                        color: index  === odabraniIndex ? 'white' : 'black'
                                                    }}
                                                    onClick={() => dodajIgraca(igrac)}
                                                    onMouseEnter={(e) => {
                                                        setOdabraniIndex(index)
                                                    }}
                                                >
                                                    {igrac.ime} {igrac.prezime}
                                                </div>
                                            ))}
                                        </div>


                                    )}
                                </Form.Group>

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
                                                {odabraniIgraci.map(igrac => (
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

                <hr className="my-4" />

                {/*Gumbi za akciju*/}

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Link to={RouteNames.KLUBOVI} className="btn btn-danger px-4">
                        Odustani
                    </Link>
                    <Button type="submit" variant="success">
                        Promjeni klub
                    </Button>
                </div>
            </Container>
        </Form>
    </>
)
}

