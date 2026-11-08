import { useEffect, useState } from "react"
import KlubService from "../../services/klubovi/KlubService"
import { Badge, Button, Table } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import IgracService from "../../services/igraci/IgracService"
import { FaFilePdf } from "react-icons/fa"
import KlubPDFGenerator from "../../components/KlubPDFGenerator"
import useBreakpoint from "../../hooks/useBreakpoint"
import KlubPregledGrid from "./KlubPregledGrid"
import KlubPregledTablica from "./KlubPregledTablica"


export default function klubPregled() {

    const [klubovi, setKlubovi] = useState([])
    const [sviIgraci, setSviIgraci] = useState([])
    const [tooltip, setTooltip] = useState({
        vidljivo: false,
        x: 0,
        y: 0,
        podaci: []
    })

    const navigate = useNavigate()
    const sirina = useBreakpoint();

    useEffect(() => {
        ucitajKlubove()
        ucitajIgrace()

    }, [])


    async function ucitajKlubove() {
        const igraciRezultat = await IgracService.get();
        await KlubService.get().then((odgovor) => {
            // console.log(JSON.stringify(odgovor.data)) 
            setKlubovi(odgovor.data)
        })
    }

    async function ucitajIgrace() {
        await IgracService.get().then((odgovor) => {
            setSviIgraci(odgovor.data) 
        })
    }


    useEffect(() => {
        //console.log('Došao na pregled kluba)
        ucitajKlubove()
    }, [])

    // --- LOGIKA ZA TOOLTIP ---
    const handleMouseEnter = (sifreIgracaUKlubu) => {
        if (!sifreIgracaUKlubu || sifreIgracaUKlubu.length === 0) return;

        // Filtriraj igrače na temelju šifri iz kluba
        const filtrirani = sviIgraci.filter(p => sifreIgracaUKlubu.includes(p.sifra));

        setTooltip(prev => ({ ...prev, vidljivo: true, podaci: filtrirani }));
    };

    const handleMouseMove = (e) => {
        // Pomicanje tooltipa 15px desno i dolje od miša da ne smeta kursoru
        //console.log(e.pageY)
        if (e.pageY > 250) {
            setTooltip(prev => ({ ...prev, x: e.pageX + 15, y: e.pageY - 100 }));
        } else {
            setTooltip(prev => ({ ...prev, x: e.pageX + 15, y: e.pageY + 15 }));
        }
    };

    const handleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, vidljivo: false, podaci: [] }));
    };


    async function obrisi(sifra) {
        if (!confirm('Sigurno obrisati?')) return;

        const igraciRezultat = await IgracService.get();
        const igraciKojeKoristeKlub = igraciRezultat.data.filter(igrac => igrac.klub === parseInt(sifra));

        if (igraciKojeKoristeKlub.length > 0) {
            alert(`Ne možete obrisati ovaj klub jer je postavljen na ${igraciKojeKoristeKlub.length} igrac/e. Prvo obrišite ili promijenite klub u tim igracima.`);
            return;
        }

        await KlubService.obrisi(sifra)
        ucitajKlubove()
    }


    async function generirajPDFZaKlub(klub) {


        const odgovorIgraci = await IgracService.get()


        const igraciKlubovi = odgovorIgraci.data.filter(p =>
            klub.igraci && klub.igraci.includes(p.sifra)
        )


        const generiraj = KlubPDFGenerator({
            klub,
            igraci: igraciKlubovi
        })
        await generiraj()
    }








            return (
                <>

                    <Link to={RouteNames.KLUBOVI_DODAJ}

                        className="btn btn-success w-100 my-3">

                        Dodavanje novog kluba
                    </Link >


                    {['xs', 'sm', 'md'].includes(sirina) ? (
                        <KlubPregledGrid
                            klubovi={klubovi}
                            navigate={navigate}
                            obrisi={obrisi}
                        />
                    ) : (
                        <KlubPregledTablica
                            klubovi={klubovi}
                            navigate={navigate}
                            obrisi={obrisi}
                        />
                    )}


                    Ukupno klubova:
                    <Badge pill bg="success">
                        {klubovi && klubovi.length}
                    </Badge>

                </>
            )
}