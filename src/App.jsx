import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import IgracPregled from './pages/igraci/IgracPregled'
import OAplikaciji from './pages/OAplikaciji'

function App() {
 
  return (
    <Container>
      <Izbornik />
      <Container className='app'>
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.IGRACI} element={<IgracPregled />} />
          <Route path={RouteNames.OAPLIKACIJI} element={<OAplikaciji />} />
        </Routes>

      </Container>
      <hr />
      &copy; {IME_APLIKACIJE}
    </Container>
  )
}

export default App
