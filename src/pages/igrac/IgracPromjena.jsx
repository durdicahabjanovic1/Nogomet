import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import IgracService from "../../services/igraci/IgracService";
import { useEffect, useState } from "react";
import KlubService from "../../services/klubovi/KlubService";


export default function IgracPromjena() {

    const navigate = useNavigate()
    const params = useParams()

    const [klubovi, setKlubovi] = useState([])
    const [igrac, setIgrac] = useState({})

    async function ucitajKlubove(){
        await KlubService.get().then((res) => {
            setKlubovi(res.data)
        } )
    }

    async function ucitajIgraca(){
        await IgracService.getBySifra(params.sifra).then((res)=>{
            setIgrac(res.data)
        })
    }

    useEffect(()=>{
        ucitajKlubove()
        ucitajIgraca()
    },[])

    async function promijeni(igraca) {
        await IgracService.promijeni(params.sifra, igrac).then(() => {
            navigate(RouteNames.Igraci)
        })
    }

    function obradiSubmit(e) { // e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        promijeni( {
            naziv: podaci.get('naziv'),
            mjesto: podaci.get('mjesto')
        })
    }


    return (
        <>
            <h3>
                Dodavanje novog igraca
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="igrac">
                    <Form.Label>Igrac</Form.Label>
                    <Form.Control type="text" name="igrac" required 
                    defaultValue={igrac.naziv}/>
                </Form.Group>

                <Form.Group controlId="klub">
                    <Form.Label>Klub</Form.Label>
                    <Form.Select name="klub" required
                    value={igrac.klub}
                    onChange={(e)=>setIgraca({...igraca, klub: parseInt(e.target.value)})}>
                        <option value="" key={0}>Obavezan odabir kluba</option>
                        {klubovi && klubovi.map((s)=>(
                             <option value={s.sifra} key={s.sifra}>
                                {s.naziv} 
                             </option>
                        ))}
                    </Form.Select>
                </Form.Group>

        



                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.IGRACI}
                            className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promjeni
                        </Button>
                    </Col>
                </Row>
            </Form>


        </>
    )
}