

import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row, Container, Card, Table, CardBody } from "react-bootstrap";
import KlubService from "../../services/klubovi/KlubService";
import { useEffect, useState } from "react";
import IgracService from "../../services/igraci/IgracService"
import ujednaciPodatke from "../../services/UjednaciPodatke";
import { useRive } from '@rive-app/react-canvas';
import useBreakpoint from "../../hooks/useBreakpoint";



export default function KlubNovi() {

    const navigate = useNavigate()
    const [igraci, setIgraci] = useState([])
    const [odabraniIgraci, setOdabraniIgraci] = useState([])
    const [pretragaIgraca, setPretragaIgraca] = useState('')
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)
      const [spustiRuke, setSpustiRuke] = useState(true);
    const [numLook, setNumLook] = useState(null);
    const sirina = useBreakpoint();

    const { rive, RiveComponent } = useRive({
        src: '/animacija.riv',
        stateMachines: 'State Machine 1', // Važno: mora odgovarati nazivu u Rive editoru
        autoplay: true,
    });

    // za ispravak ove greške treba mijenjati animaciju pa ćemo ju ostaviti. Za ubuduće koristiti animacije s triggerima i inputima
    const inputs = rive?.stateMachineInputs('State Machine 1');
    const isHandsUp = inputs?.find((i) => i.name === 'hands_up');
    const fail = inputs?.find((i) => i.name === 'fail');

    useEffect(() => {
        if (!rive || !isHandsUp) return;

        if (!spustiRuke) {
            // 1. Podigni ruke
            isHandsUp.value = true;
            // 2. Ako je tek pokrenut submit (puna lista grešaka), "stisni" fail trigger
            if (fail) fail.fire();
        } else {
            isHandsUp.value = false;
        }
    }, [ isHandsUp, fail, rive, spustiRuke]);
   

    useEffect(() => {
        ucitajIgrace()
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

    function filtrirajIgrace() {
        if (!pretragaIgraca) return []

        return igraci.filter(p =>
            !odabraniIgraci.find(op => op.sifra === p.sifra) &&
            (p.ime.toLowerCase().includes(pretragaIgraca.toLowerCase()) ||
                p.prezime.toLowerCase().includes(pretragaIgraca.toLowerCase())))
                .map((i)=>({...i, dodano: true})

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



    async function dodaj(klub) {

        const dodaniKlub = await KlubService.dodaj(klub);
        const listaIgraca = dodaniKlub.data.igraci;
       // dodaniKlub.igraci.map(async k => {
        await Promise.all(
            listaIgraca.map(async (k) => {
            const podaci = await IgracService.getBySifra(k);
            await ujednaciPodatke(dodaniKlub, podaci.data);
        })
    );
        navigate(RouteNames.KLUBOVI);
    }



    function obradiSubmit(e) { // e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)

        if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
            alert("Naziv je obavezan i ne smije sadržavati samo razmake!");
            return;
        }
        if (podaci.get('naziv').trim().length < 3) {
            alert("Naziv grupe mora imati najmanje 3 znaka!");
            return;
        }

        setSpustiRuke(false)

        


        dodaj({
            naziv: podaci.get('naziv'),
            mjesto: podaci.get('mjesto'),
            igraci: odabraniIgraci.map(p => p.sifra)
        })

        
    }


    return (
        <>
            <h3>
                Dodavanje novog kluba
            </h3>

            <Form onSubmit={obradiSubmit}>
                <Container className="mt-4">

                    <Row>

                        <Col md={6}>
                            <Card className="shadow-sm" style={{ backgroundColor: '#888c8f'}}>
                                <Card.Body>
                                    <Card.Title className="mb-4">Unos novog kluba</Card.Title>


                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label className="fw-bold">Naziv</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            placeholder="Unesite naziv kluba"
                                            style={{ backgroundColor: '#8b10105d'}}
                                            required
                                        />
                                    </Form.Group>


                                    <Form.Group controlId="mjesto" className="mb-3">
                                        <Form.Label className="fw-bold">Mjesto</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="mjesto"
                                            placeholder="Unesite mjesto kluba"
                                            style={{backgroundColor:'#72b51f'}}
                                            required
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>


                        </Col>

                        <Col md={6}>
                            <Card className="shadow-sm" style={{backgroundColor: '#5d83c2'}}>
                                <Card.Body>
                                    <Card.Title className="mb-4">Igrači</Card.Title>

                                    {/* Autocomplete pretraga */}
                                    <Form.Group className="mb-3 position-relative">
                                        <Form.Label className="fw-bold">Dodaj Igrača</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Pretraži igrača..."
                                            value={pretragaIgraca}
                                            style={{ backgroundColor: '#a9aa67' }}
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
                                                            backgroundColor: index === odabraniIndex ? '#007bff' : 'rgb(50, 149, 155)',
                                                            color: index === odabraniIndex ? '#c1c436' : '#240b0b'
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
                                                    {odabraniIgraci.map(igrac => (
                                                        <tr key={igrac.sifra}>
                                                            <td>{igrac.ime} {igrac.prezime}</td>
                                                            <td>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    disabled={!igrac.dodano}
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
                                        <p className="text-muted">Nema odabranih igrača</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <hr className="my-4" />

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Link to={RouteNames.KLUBOVI} className="btn btn-danger px-4">
                            Odustani
                        </Link>
                        <Button type="submit" variant="success">
                            Dodaj novi klub
                        </Button>
                    </div>
                </Container>
            </Form>
        </>
    )
}


