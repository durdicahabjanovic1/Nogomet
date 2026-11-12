import { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { Faker, hr } from '@faker-js/faker';
import KlubService from '../services/klubovi/KlubService';
import IgracService from '../services/igraci/IgracService';
import OperaterService from '../services/operateri/OperaterService';
import { IME_APLIKACIJE } from '../constants';



export default function  GeneriranjePodataka() {  
    const [brojKlubova, setBrojKlubova] = useState(2);
    const [brojOperatera, setBrojOperatera] = useState(5);
    const [poruka, setPoruka] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { document.title = 'Generiranje podataka, ' + IME_APLIKACIJE })


    // Postavi faker na hrvatski jezik
    const faker = new Faker({
        locale: [hr]
    });

    const generirajKlubova = async (broj) => {
        const klubovi = [];
        const naziviKlubova = [
            'HNK Hajduk',
            'NK Osijek',
            'GNK Dinamo',
            'NK Jedinstvo',
            'NK Rijeka',
            'NK Rudeš',
        ];
        for (let i = 0; i < 4; i++) {
            const igrac = {
                ime: faker.person.firstName('male'),
                prezime: faker.person.lastName(),
                brojDresa: faker.number.int({ min: 1, max: 100 }),
                brojKopackih: faker.number.int({ min: 39, max: 47 }),
                pozicija: 'ofenzivni vezni',
                datumRodenja: faker.date.birthdate(),
                brojRegistracije: '129/2026',
                klub: i < 2 ? 1 : 2,
                slika: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAEsCAIAAAAJmGvpAAADD0lEQVR4nO3SQQ0AIRDAwOP8C1tZmKAhITMK+uiamQ9O+28H8CZjkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBaJDVgNBLAk8IkcAAAAAElFTkSuQmCC'
            };
            await IgracService.dodaj(igrac);
        }

        await KlubService.dodaj({
            naziv: 'NK Osijek',
            mjesto: faker.location.city(),
            igraci: [
                1, 2
            ]
        });

        await KlubService.dodaj({
            naziv: 'NK Dinamo',
            mjesto: faker.location.city(),
            igraci: [
                3, 4
            ]
        });


    };




    const handleGeneriranjePodataka = async (e) => {   
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


    const handleObrisiPodatke = async () => {
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

            const rezultatI = await IgracService.get();
            const igraci = rezultatI.data;

            for (const i of igraci) {
                await IgracService.obrisi(i.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${klubovi.length} klubova i njihovih igrača!`
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

    const generirajOperatere = async (broj) => {
        // Prvo obriši admin operatera ako postoji
        const rezultat = await OperaterService.get();
        const operateri = rezultat.data;
        const adminOperater = operateri.find(op => op.email === 'admin@edunova.hr');

        if (adminOperater) {
            await OperaterService.obrisi(adminOperater.sifra);
        }

        // Dodaj admin operatera
        await OperaterService.dodaj({
            email: 'admin@edunova.hr',
            lozinka: 'Edunova123!',
            uloga: 'admin'
        });

        // Generiraj korisnik operatere
        for (let i = 0; i < broj; i++) {
            await OperaterService.dodaj({
                email: faker.internet.email(),
                lozinka: 'Edunova123!',
                uloga: 'korisnik'
            });
        }
    };

    const handleGenerirajOperatere = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajOperatere(brojOperatera);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojOperatera + 1} operatera (1 admin + ${brojOperatera} korisnika)!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju operatera: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiOperatere = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve operatere?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await OperaterService.get();
            const operateri = rezultat.data;

            for (const operater of operateri) {
                await OperaterService.obrisi(operater.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${operateri.length} operatera!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju operatera: ' + error.message
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
                    <Form onSubmit={handleGeneriranjePodataka}>
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
                            {loading ? 'Generiranje...' : 'Generiraj klubove i nogometaše'}
                             {loading ? 'Generiranje...' : 'Generiraj operatere'}

                        </Button>
                    </Form>
                </Col>
                <Col md={4}>
                    KASNIJE
                </Col>
                <Col md={4}>
                    KASNIJE
                </Col>

                <Col md={3}>
                    <Form onSubmit={handleGenerirajOperatere}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj operatera</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojOperatera}
                                onChange={(e) => setBrojOperatera(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                +1 admin (1-50)
                            </Form.Text>
                        </Form.Group>


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
                                onClick={handleObrisiPodatke}
                                disabled={loading}
                                className="w-100 mb-2"
                            >
                                {loading ? 'Brisanje...' : 'Obriši sve klubove'}
                            </Button>
                        </Col>
                        <Col md={4}>
                            KASNIJE
                        </Col>
                        <Col md={4}>
                            KASNIJE
                        </Col>
                    </Row>

                    <Alert variant="danger" className="mt-3">
                        <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
                    </Alert>
                </Container>
                );
}