import { useEffect, useState } from "react"
import KlubService from "../../services/klubovi/KlubService"
import { Badge} from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import IgracService from "../../services/igraci/IgracService"
import KlubPDFGenerator from "../../components/KlubPDFGenerator"
import useBreakpoint from "../../hooks/useBreakpoint"
import KlubPregledGrid from "./KlubPregledGrid"
import KlubPregledTablica from "./KlubPregledTablica"


export default function klubPregled() {

    const [klubovi, setKlubovi] = useState([])
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
    }, [])


    async function ucitajKlubove() {
        await KlubService.get().then((odgovor) => {
            // console.log(JSON.stringify(odgovor.data)) 
            setKlubovi(odgovor.data)
        })
    }



    useEffect(() => {
        //console.log('Došao na pregled kluba)
        ucitajKlubove()
    }, [])

    // --- LOGIKA ZA TOOLTIP ---
    const handleMouseEnter = (sifreIgracaUKlubu) => {
        if (!sifreIgracaUKlubu || sifreIgracaUKlubu.length === 0) return;

        // Filtriraj objekte polaznika na temelju šifri iz grupe
        const filtrirani = sviPolaznici.filter(p => sifrePolaznikaUGrupi.includes(p.sifra));

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
                if (!confirm('Sigurno obrisati')) return;

                const igraciRezultat = await IgracService.get();
                const igraciKojeKoristeKlub = igraciRezultat.data.filter(igrac => igrac.klub === parseInt(sifra));

                if (igraciKojeKoristeKlub.length > 0) {
                    alert(`Ne možete obrisati ovaj klub jer je postavljen na ${igraciKojeKoristeKlub.length} igrač/e. Prvo obrišite ili promijenite klub u tim igracima.`);
                    return;
                }





                await KlubService.obrisi(sifra);
                await KlubService.get().then((odgovor) => {
                    set(odgovor.data)
                })
            }


            async function generirajPDFZaKlub(klub) {
                console.log(klub)

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
                            generirajPDFZaKlub={generirajPDFZaKlub}
                        />
                    ) : (
                        <KlubPregledTablica
                            klubovi={klubovi}
                            navigate={navigate}
                            obrisi={obrisi}
                            generirajPDFZaKlub={generirajPDFZaKlub}
                        />
                    )}


                    Ukupno klubova: & nbsp;
                    <Badge pill bg="success">
                        {klubovi && klubovi.length}
                    </Badge>

                </>
            )
        }
    
