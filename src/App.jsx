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
import KlubPregled from './pages/klubovi/KluboviPregled';


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

          Route path={RouteNames.KLUBOVI} element={<KlubPregled />} /
        </Routes>

      </Container>
      <hr />
      &copy; {IME_APLIKACIJE}
    </Container>
  )
}

export default App
