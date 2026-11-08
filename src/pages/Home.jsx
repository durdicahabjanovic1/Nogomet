





import { Button, Card, Col, Row } from 'react-bootstrap'
import { FaBuilding, FaDice, FaFutbol, FaUsers } from 'react-icons/fa'
import { IME_APLIKACIJE, RouteNames } from '../constants'
import { useNavigate } from 'react-router-dom'

const opcije = [
    {
        naziv: 'Igrači',
        opis: 'Pregledajte, dodajte i uređujte podatke o nogometašima na jednom mjestu.',
        Ikona: FaUsers,
        ruta: RouteNames.IGRACI,
        boja: 'primary'
    },
    {
        naziv: 'Klubovi',
        opis: 'Vodite nogometne klubove i pratite koje ih igrače okupljaju.',
        Ikona: FaBuilding,
        ruta: RouteNames.KLUBOVI,
        boja: 'success'
    },
    {
        naziv: 'Generiraj podatke',
        opis: 'Brzo stvorite testne podatke kako biste aplikaciju odmah probali.',
        Ikona: FaDice,
        ruta: RouteNames.GENERIRANJE_PODATAKA,
        boja: 'warning'
    }
]

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="py-2">
            <div className="nogomet-hero p-4 p-lg-5 rounded-4 mb-4">
                <Row className="align-items-center g-4">
                    <Col md={6} className="text-center text-md-start">
                        <h1 className="fw-bold mb-3">{IME_APLIKACIJE}</h1>
                        <p className="lead mb-4">
                            Aplikacija za vođenje podataka o nogometnim igračima i
                            klubovima — jednostavna, brza i pregledna.
                        </p>
                        <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                            <Button variant="light" onClick={() => navigate(RouteNames.IGRACI)}>
                                <FaUsers className="me-2" />Igrači
                            </Button>
                            <Button variant="outline-light" onClick={() => navigate(RouteNames.KLUBOVI)}>
                                <FaBuilding className="me-2" />Klubovi
                            </Button>
                        </div>
                    </Col>
                    <Col md={6} className="text-center">
                        <img
                            src="/slika lopte.jpg"
                            alt="Nogometna lopta"
                            className="img-fluid nogomet-lopta rounded-circle shadow-lg"
                            style={{ maxWidth: '320px', objectFit: 'cover' }}
                        />
                    </Col>
                </Row>
            </div>

            <h2 className="h4 mb-3">Kako početi?</h2>
            <Row className="g-3">
                {opcije.map((opcija) => {
                    const Ikona = opcija.Ikona
                    return (
                        <Col key={opcija.naziv} xs={12} md={4}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="d-flex flex-column text-center">
                                    <Ikona size={36} className="mx-auto mb-3 text-primary" />
                                    <Card.Title>{opcija.naziv}</Card.Title>
                                    <Card.Text className="flex-grow-1">{opcija.opis}</Card.Text>
                                    <Button
                                        variant={opcija.boja}
                                        className="w-100"
                                        onClick={() => navigate(opcija.ruta)}
                                    >
                                        <FaFutbol className="me-2" />Otvori
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </div>
    )
}