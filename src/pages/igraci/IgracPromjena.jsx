import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row } from "react-bootstrap";
import IgracService from "../../services/igraci/IgracService"
import { useEffect, useState } from "react";
import { useEffect, useRef, useState } from "react";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import KlubService from "../../services/klubovi/KlubService"



export default function IgracPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [klubovi, setKlubovi] = useState([])
    const [igrac, setIgrac] = useState({})
    const [slikaZaCrop, setSlikaZaCrop] = useState(null);
    const cropperRef = useRef(null);


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

        let dataUrl = null
        if (cropperRef.current && cropperRef.current.cropper && cropperRef.current.cropper.cropped) {
            const cropper = cropperRef.current.cropper;
            const selectionData = cropper.getData();
            const actualWidth = selectionData.width;
            const actualHeight = selectionData.height;
            const targetSize = 400;
            const canvasWidth = actualWidth > targetSize ? targetSize : actualWidth;
            const canvasHeight = actualHeight > targetSize ? targetSize : actualHeight;
            const canvas = cropper.getCroppedCanvas({
                width: canvasWidth,
                height: canvasHeight,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });
            dataUrl = canvas.toDataURL('image/png');
        }

        promijeni({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            brojDresa: podaci.get('brojDresa'),
            brojKopackih: podaci.get('brojKopackih'),
            pozicija: podaci.get('pozicija'),
            datumRodenja: podaci.get('datumRodenja'),
            brojRegistracije: podaci.get('brojRegistracije'),
            slika: dataUrl


        })
    }
     function onChangeImage(e) {
        e.preventDefault();

        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setSlikaZaCrop(reader.result);
        };
        try {
            reader.readAsDataURL(files[0]);
        } catch (error) {
            console.error(error);
        }
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
                                defaultValue={igrac.brojKopackih} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="pozicija">
                            <Form.Label>Pozicija</Form.Label>
                            <Form.Control type="text" name="pozicija"
                                defaultValue={igrac.pozicija} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="datumRodenja">
                            <Form.Label>Datum rođenja</Form.Label>
                            <Form.Control type="date" name="datumRodenja"
                                defaultValue={igrac.datumRodenja} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="brojRegistracije">
                            <Form.Label>Broj registracije</Form.Label>
                            <Form.Control type="text" name="brojRegistracije"
                                defaultValue={igrac.brojRegistracije} />
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
               <h3>Promjeni igraca</h3>
            <Row>
                
                <Col md={6}>



                    <Form onSubmit={obradiSubmit}>
                        <Form.Group controlId="ime">
                            <Form.Label>Ime</Form.Label>
                            <Form.Control
                                type="text"
                                name="ime"
                                defaultValue={igrac.ime}
                            />
                        </Form.Group>

                        <Form.Group controlId="prezime">
                            <Form.Label>Prezime</Form.Label>
                            <Form.Control
                                type="text"
                                name="prezime"
                                defaultValue={igrac.prezime}
                            />
                        </Form.Group>

                        <Form.Group controlId="brojDresa">
                            <Form.Label>BrojDresa</Form.Label>
                            <Form.Control
                                type="number"
                                name="brojDresa"
                                defaultValue={igrac.brojDresa}
                            />
                        </Form.Group>

                        <Form.Group controlId="brojKopackih">
                            <Form.Label>BrojKopackih</Form.Label>
                            <Form.Control
                                type="number"
                                name="brojKopackih"
                                maxLength={11}
                                defaultValue={igrac.brojKopackih}

                                 <Form.Group controlId="pozicija">
                            <Form.Label>Pozicija</Form.Label>
                            <Form.Control
                                type="text"
                                name="pozicija"
                                maxLength={11}
                                defaultValue={igrac.pozicija}

                                 <Form.Group controlId="datumRodenja">
                            <Form.Label>DatumRodenja</Form.Label>
                            <Form.Control
                                type="number"
                                name="datumRodenja"
                                maxLength={11}
                                defaultValue={igrac.datumRodenja}

                                 <Form.Group controlId="datumRegistracije">
                            <Form.Label>DatumRegistracije</Form.Label>
                            <Form.Control
                                type="number"
                                name="datumRegistracije"
                                maxLength={11}
                                defaultValue={igrac.datumRegistracije}
                            />
                        </Form.Group>

                        <Row className="mt-4">
                            <Col>
                                <Link to={RouteNames.IGRACI} className="btn btn-danger">
                                    Odustani
                                </Link>
                            </Col>
                            <Col>
                                <Button type="submit" variant="success">
                                    Promjeni igrača
                                </Button>
                            </Col>
                        </Row>

                    </Form>
                </Col>
                <Col lg={6}>
                    <input className='mb-3' type='file' onChange={onChangeImage} />
                    <Cropper
                        src={slikaZaCrop}
                        style={{ height: 400, width: '100%' }}
                        initialAspectRatio={1}
                        guides={true}
                        autoCropArea={1}
                        viewMode={1}
                        minCropBoxWidth={400}
                        minCropBoxHeight={400}
                        cropBoxResizable={false}
                        background={false}
                        responsive={true}
                        checkOrientation={false}
                        ref={cropperRef}
                    />
                </Col>
            </Row>


        </>
    )

