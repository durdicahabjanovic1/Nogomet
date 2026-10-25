import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import IgracPregled from './pages/igraci/IgracPregled'
import OAplikaciji from './pages/OAplikaciji'
import IgracNovi from './pages/igraci/IgracNovi';
import IgracPromjena from './pages/igraci/IgracPromjena';
import KlubPregled from './pages/klubovi/KlubPregled';
import KlubNovi from './pages/klubovi/KlubNovi'
import KlubPromjena from './pages/klubovi/KlubPromjena'
import GeneriranjePodataka from './pages/GeneriranjePodataka'


function App() {
 
  return (
    <Container>
      <Izbornik />
      <Container className='app'>
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.IGRACI} element={<IgracPregled />} />
          <Route path={RouteNames.OAPLIKACIJI} element={<OAplikaciji />} />
          <Route path={RouteNames.IGRACI_DODAJ} element={<IgracNovi />} />
          <Route path={RouteNames.IGRACI_PROMJENA} element={<IgracPromjena />} />

          <Route path={RouteNames.KLUBOVI} element={<KlubPregled />} />
          <Route path={RouteNames.KLUBOVI_DODAJ} element={<KlubNovi />} />
          <Route path={RouteNames.KLUBOVI_PROMJENA} element={<KlubPromjena />} />
          
            <Route path={RouteNames.GENERIRANJE_PODATAKA} element={<GeneriranjePodataka />} />
        </Routes>

      </Container>
      <hr />
      &copy; {IME_APLIKACIJE}
    </Container>
  )
}

export default App
