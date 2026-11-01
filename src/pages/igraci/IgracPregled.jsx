import { useEffect, useState } from "react"
import IgracService from "../../services/igraci/IgracService"
import { Badge, Button, Table } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import { FaEdit, FaTrash } from "react-icons/fa"



export default function IgracPregled() {

    const navigate = useNavigate()

    const [igraci, postaviIgrace] = useState([])
    const [trenutnaStranica, postaviTrenutnuStranicu] = useState(1)
    const [ukupnoStranica, postaviUkupnoStranica] = useState(0)
    const [ukupnoStavki, postaviUkupnoStavki] = useState(0)
    const velicinaStranice = 4

    useEffect(() => {
        ucitajIgrace(trenutnaStranica)
    }, [trenutnaStranica])



    async function ucitajIgrace(stranica) {
        await IgracService.dohvatiStranicu(stranica, velicinaStranice).then((odgovor) => {
            postaviIgrace(odgovor.data)
            postaviUkupnoStranica(odgovor.ukupnoStranica)
            postaviUkupnoStavki(odgovor.ukupnoStavki)
          
        })

    }

      async function brisanje(sifra) {
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

    function promijeniStranicu(stranica) {
        postaviTrenutnuStranicu(stranica)
    }
    
     
   

    useEffect(() => {
        ucitajKlubove()
        ucitajIgrace()
    }, [])




    async function obrisi(sifra) {
        if (!confirm('Sigurno obrisati?')) {
            return
        }
        await IgracService.obrisi(sifra)
        ucitajIgrace()
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
                                        {igrac.ime} {igrac.prezime} <span style={{fontSize: '0.5rem'}}</span> 
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
                                            onClick={() => brisanje(igrac.sifra)}
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
            <Table hover striped bordered>

                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Klub</th>
                        <th>Broj dresa</th>
                        <th>Broj kopačkih</th>
                        <th>Pozicija</th>
                        <th>Datum rođenja</th>
                        <th>Broj registracije</th>
                        <th>
                            Akcija
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {igraci && igraci.map((igrac) => (
                        <tr key={igrac.sifra}>
                            <td>{igrac.ime}</td>
                            <td>{igrac.prezime}</td>
                            <td>
                                {dohvatiNazivKluba(igrac.klub)}
                            </td>
                            <td>{igrac.brojDresa}</td>
                            <td>{igrac.brojKopackih}</td>
                            <td>{igrac.pozicija}</td>
                            <td>{igrac.datumRodenja}</td>
                            <td>{igrac.brojRegistracije}</td>

                            <td>
                                <Button onClick={() => { navigate(`/igraci/${igrac.sifra}`) }}>
                                    Promjena

                                </Button>
                                &nbsp;&nbsp;
                                <Button variant="danger" onClick={() => obrisi(igrac.sifra)}>
                                    Obriši
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            Ukupno igraca: &nbsp;
            <Badge pill bg="success">
                {igraci && igraci.length}
            </Badge>

        </>
    )
}

