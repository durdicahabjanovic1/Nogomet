
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { DATA_SOURCE, IME_APLIKACIJE, RouteNames } from '../constants';
import { useNavigate } from 'react-router-dom';
import { FaMemory } from 'react-icons/fa';
import { GrServer, GrStatusUnknown, GrVirtualStorage } from 'react-icons/gr';
import useAuth from '../hooks/useAuth';



export default function Izbornik() {

    const navigate = useNavigate()
    const { isLoggedIn, logout, authUser } = useAuth()

    function izvor() {
        switch (DATA_SOURCE) {
            case 'memorija':
                return <FaMemory title='Memorija' />
            case 'localStorage':
                return <GrVirtualStorage title='Local storage' />
                 case 'firebase':
                return <GrServer title='Firebase' />
            default:
                return <GrStatusUnknown title='Nepoznato' />
        }
    }



    return (
        <Navbar expand="lg" className="bg-body-tertiary">

            <Container>
                {izvor()} {IME_APLIKACIJE}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            onClick={() => navigate(RouteNames.HOME)}
                            eventKey="početna"
                        >Početna</Nav.Link>
                        {isLoggedIn && (
                            <>
                                <NavDropdown title="Programi" id="basic-nav-dropdown">

                                    <NavDropdown.Item
                                        onClick={() => navigate(RouteNames.IGRACI)}
                                    >Igrači</NavDropdown.Item>

                                    <NavDropdown.Item
                                        onClick={() => navigate(RouteNames.KLUBOVI)}
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
                                    onClick={() => navigate(RouteNames.OAPLIKACIJI)}
                                >O Aplikaciji</Nav.Link>


                                <Nav.Link
                                    onClick={() => navigate(RouteNames.NADZORNA_PLOCA)}
                                    eventKey="nadzorna-ploca"
                                >Nadzorna ploča</Nav.Link>
                            </>
                        )}
                    </Nav>







                    <Nav className="ms-auto">
                        <div className="btn-group">
                            {isLoggedIn ? (
                                <Nav.Link
                                    onClick={() => logout()}
                                    className='btn btn-primary'
                                    style={{ color: 'white', backgroundColor: '#0d6efd' }}
                                    eventKey="logout"
                                >Logout {authUser.email}</Nav.Link>
                            ) : (
                                <>
                                    <Nav.Link
                                        onClick={() => navigate(RouteNames.REGISTRACIJA)}
                                        className='me-2 btn btn-primary'
                                        style={{ color: 'white', backgroundColor: '#0d6efd' }}
                                        eventKey="registracija"
                                    >Registracija</Nav.Link>
                                    <Nav.Link
                                        onClick={() => navigate(RouteNames.LOGIN)}
                                        className='btn btn-primary'
                                        style={{ color: 'white', backgroundColor: '#0d6efd' }}
                                        eventKey="login"
                                    >Login</Nav.Link>
                                </>)}
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container >
        </Navbar >
    )
}


