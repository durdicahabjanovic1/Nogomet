import { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { Faker, hr } from '@faker-js/faker';
import KlubService from '../services/klubovi/KlubService';
import IgracService from '../services/igraci/IgracService';
import igracService from '../services/igraci/IgracService';


export default function GeneriranjePodataka() {
    const [brojKlubova, setBrojKlubova] = useState(5);
    const [brojIgraca, setBrojIgraca] = useState(20);
    const [brojIgraca, setBrojIgraca] = useState(10);
    const [poruka, setPoruka] = useState(null);
    const [loading, setLoading] = useState(false);

    // Postavi faker na hrvatski jezik
    const faker = new Faker({
        locale: [hr]
    });

    const generirajKlubova = async (broj) => {
        const naziviKlubova = [
            'HNK Hajduk',
            'NK Osijek',
            'GNK Dinamo',
            'NK Jedinstvo',
             'NK Rijeka',
             'NK Rudeš',
        ];

        for (let i = 0; i < broj; i++) {
            await KlubService.dodaj({
                naziv: naziviKlubova[i % naziviKlubova.length] + (i >= naziviKlubova.length ? ` ${Math.floor(i / naziviKlubova.length) + 1}` : ''),
                trajanje: faker.number.int({ min: 130, max: 350 }),
                cijena: faker.number.float({ min: 1100, max: 5000, precision: 0.01 }).toFixed(2),
                datumPokretanja: faker.date.soon().toISOString().split('T')[0],
                aktivan: faker.datatype.boolean()
            });
        }
    };

    const generirajIgrace = async (broj) => {
        for (let i = 0; i < broj; i++) {
            const igrac = {
                ime: i%2===0? faker.person.firstName('male') : faker.person.firstName('female'),
                prezime: faker.person.lastName(),
                email: faker.internet.email(),
                oib: faker.string.numeric(11)
            };
            await IgracService.dodaj(igrac);
        }
    };

    const generirajIgrace = async (broj) => {

        // Dohvati sve klubove
        const rezultatKlubovi = await KlubService.get();
        const klubovi = rezultatKlubovi.data;

        
        if (klubovi.length === 0) {
            throw new Error('Nema dostupnih klubova. Prvo generirajte klubove.');
        }
        
        for (let i = 0; i < broj; i++) {
            // Odaberi nasumični klub
            const randomKlub = klubovi[faker.number.int({ min: 0, max: klubovi.length - 1 })];
  
            const igrac = {
                naziv: randomKlub.naziv.trim().split(/\s+/).slice(0, 2).map(rijec => rijec[0]).join('').toUpperCase(),   
                smjer: randomKlub.sifra
            };
            
            await IgracService.dodaj(igrac);
        }
    };

    const handleGenerirajKlubove = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajKlubova(brojKlubova);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojKlubova} klubova!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju klubova: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerirajIgrace = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            
            await generirajIgrace(brojIgraca);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojIgraca} igraca!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju igraca: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiIgrace = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve igrace?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await IgracService.get();
            const igraci = rezultat.data;
            
            for (const igrac of igraci) {
                await IgracService.obrisi(igrac.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${igraci.length} igraci!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju igraca: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiKlubove = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve klubove?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await KlubService.get();
            const klubovi = rezultat.data;
            
            for (const klub of klubovi) {
                await KlubService.obrisi(klub.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${klubovi.length} klubova!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju klubova: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerirajGrupe = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajIgrace(brojIgraca);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojIgraca} igraca!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju igraca: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiIgrace = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve igrace?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await IgracService.get();
            const igraci = rezultat.data;
            
            for (const igrac of igraci) {
                await IgracService.obrisi(igrac.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${igraci.length} igrac!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju igraca: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <h1>Generiranje podataka</h1>
            <p className="text-muted">
                Koristite ovaj alat za generiranje testnih podataka s lažnim (fake) podacima na hrvatskom jeziku.
            </p>

            {poruka && (
                <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>
                    {poruka.tekst}
                </Alert>
            )}

            <Row>
                <Col md={4}>
                    <Form onSubmit={handleGenerirajKlubove}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj klubova</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojKlubova}
                                onChange={(e) => setBrojKlubova(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj klubova (1-50)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj klubove'}
                        </Button>
                    </Form>
                </Col>
                <Col md={4}>
                    <Form onSubmit={handleGenerirajIgrace}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj igraca</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="200"
                                value={brojIgraca}
                                onChange={(e) => setBrojIgraca(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj igraca (1-200)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj igrace'}
                        </Button>
                    </Form>
                </Col>
                <Col md={4}>
                    <Form onSubmit={handleGenerirajIgrace}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj igraca</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="100"
                                value={brojIgraca}
                                onChange={(e) => setBrojIgraca(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj igraca (1-100)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj igraca'}
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Alert variant="warning" className="mt-3">
                <strong>Upozorenje:</strong> Ove akcije će dodati nove podatke u postojeće. 
                Ako želite početi ispočetka, prvo obrišite postojeće podatke.
            </Alert>

            <hr className="my-4" />

            <h3>Brisanje podataka</h3>
            <p className="text-muted">
                Koristite ove opcije za brisanje svih podataka iz baze.
            </p>

            <Row className="mt-3">
                <Col md={4}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiKlubove}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve klubove'}
                    </Button>
                </Col>
                <Col md={4}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiIgrace}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve igrace'}
                    </Button>
                </Col>
                <Col md={4}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiIgrace}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve igrace'}
                    </Button>
                </Col>
            </Row>

            <Alert variant="danger" className="mt-3">
                <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
            </Alert>
        </Container>
    );
}