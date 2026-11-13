
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { IME_APLIKACIJE, RouteNames } from '../constants';
import { useNavigate } from 'react-router-dom';
import { FaMemory } from 'react-icons/fa';
import { GrStatusUnknown, GrVirtualStorage } from 'react-icons/gr';


export default function Izbornik() {
    
const navigate= useNavigate()

 function izvor() {
        switch (DATA_SOURCE) {
            case 'memorija':
                return <FaMemory title='Memorija' />
            case 'localStorage':
                return <GrVirtualStorage title='Local storage' />
            default:
                return <GrStatusUnknown title='Nepoznato' />
        }
    }



    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">
                    {IME_APLIKACIJE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link 
                        onClick={()=>navigate(RouteNames.HOME)}
                        >Početna</Nav.Link>
                       
                        <NavDropdown title="Programi" id="basic-nav-dropdown">

                            <NavDropdown.Item
                            onClick={()=>navigate(RouteNames.IGRACI)}
                            >Igrači</NavDropdown.Item>

                             <NavDropdown.Item
                            onClick={()=>navigate(RouteNames.KLUBOVI)}
                            >Klubovi</NavDropdown.Item>

                          <NavDropdown.Divider />
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.GENERIRANJE_PODATAKA)}
                            >Generiraj podatke</NavDropdown.Item>
                            <NavDropdown.Item
                            onClick={() => navigate(RouteNames.OPERATERI)}
                            >Operateri</NavDropdown.Item>
                           
                        </NavDropdown>
                         <Nav.Link 
                        onClick={()=>navigate(RouteNames.OAPLIKACIJI)}
                        >O Aplikaciji</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}