
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { DATA_SOURCE, IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import KlubPregled from './pages/klubovi/KlubPregled'
import KlubNovi from './pages/klubovi/KlubNovi'
import KlubPromjena from './pages/klubovi/KlubPromjena'
import IgracPregled from './pages/igraci/IgracPregled'
import IgracNovi from './pages/igraci/IgracNovi'
import IgracPromjena from './pages/igraci/IgracPromjena'
import GeneriranjePodataka from './pages/GeneriranjePodataka'
import OperaterPregled from './pages/operateri/OperaterPregled'
import OperaterNovi from './pages/operateri/OperaterNovi'
import OperaterPromjena from './pages/operateri/OperaterPromjena'
import OperaterPromjenaLozinke from './pages/operateri/OperaterPromjenaLozinke'
import useAuth from './hooks/useAuth'
import Login from './pages/login/Login'
import Registracija from './pages/registracija/Registracija'
import NadzornaPloca from './pages/NadzornaPloca'

function App() {
  const { isLoggedIn, authUser } = useAuth()
  

  return (
    

      <Container>

        <Izbornik />
        <Container className='app'>
          <Routes>
            <Route path={RouteNames.HOME} element={<Home />} />
            {isLoggedIn ? (
              <>
                <Route path={RouteNames.NADZORNA_PLOCA} element={<NadzornaPloca />} />

            <Route path={RouteNames.KLUBOVI} element={<KlubPregled />} />
            <Route path={RouteNames.KLUBOVI_DODAJ} element={<KlubNovi />} />
            <Route path={RouteNames.KLUBOVI_PROMJENA} element={<KlubPromjena />} />


            <Route path={RouteNames.IGRACI} element={<IgracPregled />} /> 
            <Route path={RouteNames.IGRACI_DODAJ} element={<IgracNovi />} />
            <Route path={RouteNames.IGRACI_PROMJENA} element={<IgracPromjena />} />
            {authUser?.uloga === 'admin' && (
              <>


            <Route path={RouteNames.OPERATERI} element={<OperaterPregled />} />
            <Route path={RouteNames.OPERATERI_NOVI} element={<OperaterNovi />} />
            <Route path={RouteNames.OPERATERI_PROMJENA} element={<OperaterPromjena />} />
            <Route path={RouteNames.OPERATERI_PROMJENA_LOZINKE} element={<OperaterPromjenaLozinke />} />
             <Route path={RouteNames.GENERIRANJE_PODATAKA} element={<GeneriranjePodataka />} />
              </>
            )}
            </>
            ) : (
              <>
               <Route path={RouteNames.LOGIN} element={<Login />} />
                <Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />
              </>
            )}
            </Routes>
            </Container>
            <hr />
            &copy; {IME_APLIKACIJE} ({DATA_SOURCE})
            </Container>
  )
            


}
             
        
        
        

        export default App

   