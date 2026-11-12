
import { Badge, Card, Col, Row } from 'react-bootstrap'
import { FaBuilding, FaCode,FaDatabase, FaDice, FaLaptopCode, FaRocket, FaUsers} from 'react-icons/fa'
import { DATA_SOURCE, IME_APLIKACIJE } from '../constants'




export default function OAplikaciji() {


    const znacajke = [
        { Ikona: FaUsers, tekst: 'Pregled, dodavanje i uređivanje nogometaša' },
        { Ikona: FaBuilding, tekst: 'Upravljanje nogometnim klubovima' },
        { Ikona: FaDice, tekst: 'Automatsko generiranje testnih podataka' },
        { Ikona: FaDatabase, tekst: 'Trenutni izvor podataka: ' + DATA_SOURCE },
        { Ikona: FaRocket, tekst: 'Brza i jednostavna korisnička površina' }
    ];

    const tehnologija = ['React', 'Vite', 'Bootstrap', 'React Router', 'React Icons'];



    return (
        <div className="py-2">
            <h1 className="fw-bold mb-3">O aplikaciji</h1>
            <p className="lead text-muted">
                {IME_APLIKACIJE} je web aplikacija za vođenje podataka o nogometnim
                igračima i klubovima. Omogućuje pregled, dodavanje i uređivanje
                igrača te upravljanje klubovima na pregledan i jednostavan način.
            </p>

            <Row className="g-4 mt-2">
                <Col md={7}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body>
                            <Card.Title>
                                <FaLaptopCode className="me-2" /> Što aplikacija omogućuje?
                            </Card.Title>
                            <ul className="mb-0">
                                {znacajke.map((znacajka) => {
                                    const Ikona = znacajka.Ikona;
                                    return (
                                        <li key={znacajka.tekst} className="d-flex align-items-center mb-2">
                                            <Ikona className="me-2 text-success" />
                                            <span>{znacajka.tekst}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body>
                            <Card.Title>
                                <FaCode className="me-2" />Korištena tehnologija
                            </Card.Title>
                            <p className="text-muted">
                                Aplikacija je izrađena u modernom JavaScript
                                ekosustavu.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                {tehnologija.map((t) => (
                                    <Badge key={t} bg="dark" className="fs-6">{t}</Badge>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
