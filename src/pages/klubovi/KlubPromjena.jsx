import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import KlubService from "../../services/klubovi/KlubService";
import { useEffect, useState } from "react";


export default function KlubPromjena() {

    const navigate = useNavigate()

    const params = useParams()

    const [klub, setKlub] = useState({})

    async function ucitajKlub(){
        await KlubService.getBySifra(params.sifra).then((odgovor)=>{
            setKlub(odgovor.data)
        })
    }

    useEffect(()=>{
        ucitajKlub()
    },[])

    async function promijeni(klub) {
        await KlubService.promijeni(params.sifra, klub).then(() => {
            navigate(RouteNames.KLUBOVI)
        })
    }

    function obradiSubmit(e) { // e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        promijeni({
            naziv: podaci.get('naziv'),
            mjesto: podaci.get('mjesto'),
           
        })
    }


    return (
        <>
            <h3>
                Promijeni klub
            </h3>

            <Form onSubmit={obradiSubmit}>


                <Form.Group controlId="naziv">
                    <Form.Label>NAZIV</Form.Label>
                    <Form.Control type="text" name="naziv" 
                    defaultValue={klub.naziv}/>
                </Form.Group>

                <Form.Group controlId="mjesto">
                    <Form.Label>MJESTO</Form.Label>
                    <Form.Control type="text" name="mjesto" 
                    defaultValue={klub.mjesto}/>
                </Form.Group>

              



                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.KLUBOVI}
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