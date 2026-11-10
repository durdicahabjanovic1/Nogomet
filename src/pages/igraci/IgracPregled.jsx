import { useEffect, useState } from "react"
import IgracService from "../../services/igraci/IgracService"
import { Row, Col, Card, Button, Pagination, InputGroup, Form } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa"
import KlubService from "../../services/klubovi/KlubService"



export default function IgracPregled() {

    const navigate = useNavigate()
    const [klubovi, setKlubovi] = useState([])

    const [igraci, postaviIgrace] = useState([])
    const [trenutnaStranica, postaviTrenutnuStranicu] = useState(1)
    const [ukupnoStranica, postaviUkupnoStranica] = useState(0)
    const [ukupnoStavki, postaviUkupnoStavki] = useState(0)
    const [uvjetPretrazivanja, setUvjetPretrazivanja] = useState('')
    const velicinaStranice = 4

    useEffect(() => {
        ucitajIgrace(trenutnaStranica)
    }, [trenutnaStranica, uvjetPretrazivanja])


    async function ucitajKlubove() {
        await KlubService.get().then((odgovor) => {
            setKlubovi(odgovor.data)
        })
    }

    async function ucitajIgrace(stranica) {
        //console.log('Učitavam igrače')
      // debugger
        await IgracService.dohvatiStranicu(stranica, velicinaStranice, uvjetPretrazivanja).then((odgovor) => {
            postaviIgrace(odgovor.data)
            postaviUkupnoStranica(odgovor.ukupnoStranica)
            postaviUkupnoStavki(odgovor.ukupnoStavki)

        })

    }



    function promijeniStranicu(stranica) {
            
        postaviTrenutnuStranicu(stranica)
    }

    function promjeniUvjetPretrazivanja(e) {
        setUvjetPretrazivanja(e.target.value)
        postaviTrenutnuStranicu(1)
    }





    useEffect(() => {
        ucitajKlubove()
        ucitajIgrace()
    }, [])




    async function obrisi(sifra) {
        if (!confirm('Sigurno obrisati?')) return;
        await IgracService.obrisi(sifra);

        const noveUkupneStavke = ukupnoStavki - 1;
        const noveUkupneStranice = Math.ceil(noveUkupneStavke / velicinaStranice);

        if (trenutnaStranica > noveUkupneStranice && noveUkupneStranice > 0) {
            postaviTrenutnuStranicu(noveUkupneStranice);
        } else {
            ucitajIgrace(trenutnaStranica);
        }
    }

    function dohvatiNazivKluba(sifraKluba) {
        const klub = klubovi.find(s => s.sifra === sifraKluba)
        return klub.naziv
    }







    return (
        <>

            <Link to={RouteNames.IGRACI_DODAJ}
                className="btn btn-success w-100 my-3">

                Dodavanje novog igraca
            </Link >
            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <FaSearch />
                </InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder="Pretraži igrače (ime, prezime, brojDresa, brojKopackih, pozicija, datumRodenja, brojRegistracije)..."
                    value={uvjetPretrazivanja}
                    onChange={promjeniUvjetPretrazivanja}
                />
            </InputGroup>


            <Row>
                {igraci && igraci.map((igrac) => (
                    <Col key={igrac.sifra} xs={12} sm={6} lg={4} xl={3} className="mb-4">
                        <Card className="shadow-sm h-100 border-0">
                            <div style={{ height: "200px", overflow: "hidden" }}>
                                <Card.Img
                                    variant="top"
                                    src={igrac.slika}
                                    style={{
                                        objectFit: "cover",
                                        height: "100%",
                                        width: "100%"
                                    }}
                                />
                            </div>

                            <Card.Body className="d-flex flex-column">
                                <Card.Title>
                                    {igrac.ime} {igrac.prezime} <br />
                                    <span style={{ fontSize: '0.5rem' }}>{dohvatiNazivKluba(igrac.klub)}</span>
                                </Card.Title>



                                <div className="mt-auto d-flex gap-2">
                                    <Button
                                        variant="outline-primary"
                                        className="flex-fill"
                                        onClick={() => navigate(`/igraci/${igrac.sifra}`)}
                                        title="Promjeni">
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => obrisi(igrac.sifra)}
                                        title="Obriši"
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {ukupnoStranica > 1 && (
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.First
                            onClick={() => promijeniStranicu(1)}
                            disabled={trenutnaStranica === 1}
                        />
                        <Pagination.Prev
                            onClick={() => promijeniStranicu(trenutnaStranica - 1)}
                            disabled={trenutnaStranica === 1}
                        />

                        {[...Array(ukupnoStranica)].map((_, indeks) => {
                            const brojStranice = indeks + 1;
                            if (
                                brojStranice === 1 ||
                                brojStranice === ukupnoStranica ||
                                (brojStranice >= trenutnaStranica - 2 && brojStranice <= trenutnaStranica + 2)
                            ) {
                                return (
                                    <Pagination.Item
                                        key={brojStranice}
                                        active={brojStranice === trenutnaStranica}
                                        onClick={() => promijeniStranicu(brojStranice)}
                                    >
                                        {brojStranice}
                                    </Pagination.Item>
                                );
                            } else if (
                                brojStranice === trenutnaStranica - 3 ||
                                brojStranice === trenutnaStranica + 3
                            ) {
                                return <Pagination.Ellipsis key={brojStranice} disabled />;
                            }
                            return null;
                        })}

                        <Pagination.Next
                            onClick={() => promijeniStranicu(trenutnaStranica + 1)}
                            disabled={trenutnaStranica === ukupnoStranica}
                        />
                        <Pagination.Last
                            onClick={() => promijeniStranicu(ukupnoStranica)}
                            disabled={trenutnaStranica === ukupnoStranica}
                        />
                    </Pagination>
                </div>
            )}
        </>
    )
}


