import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row } from "react-bootstrap";
import IgracService from "../../services/igraci/IgracService"
import { useEffect, useState } from "react";
import KlubService from "../../services/klubovi/KlubService"



export default function IgracPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [klubovi, setKlubovi] = useState([])
    const [igrac, setIgrac] = useState({})

    async function ucitajKlubove() {
        await KlubService.getBySifra(params.sifra).then((res) => {
            setKlubovi(res.data)


        })
    }
    async function ucitajIgrac() {
        await IgracService.getBySifra(params.sifra).then((res) => {
            setIgrac(res.data)
        })
    }




    useEffect(() => {
        ucitajKlubove()

        ucitajIgraca()
    }, [])


    async function promijeni(igraca) {
        await IgracService.promijeni(params.sifra, igraca).then(() => {
            navigate(RouteNames.IGRACI)
        })
    }


    function obradiSubmit(e) { // e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        promijeni({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            klub: parseInt( podaci.get('klub'))
          
        })
    }



    return (
        <>
            <h3>
                Dodavanje novog igraca
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime" required
                        defaultValue={igrac.ime} />
                </Form.Group>

                <Form.Group controlId="prezime">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" name="prezime" required
                        defaultValue={igrac.prezime} />
                </Form.Group>

                 <Form.Group controlId="klub">
                    <Form.Label>Klub</Form.Label>
                   <Form.Select name="klub" required
                   value={igrac.klub}
                   onChange={(e)=>setIgrac({...igrac, klub: parseInt(e.target.value)})}>
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
                            Promijeni
                        </Button>
                    </Col>
                </Row>
            </Form>


        </>
    )
}
