import { useState, useEffect } from "react";
import KlubService from "../services/klubovi/KlubService";
import { Container } from "react-bootstrap";
import Highcharts from 'highcharts';
import {HighchartsReact} from 'highcharts-react-official';




export default function NadzornaPloca() {

     const [podaci, setPodaci] = useState([]);




    async function getPodaci() {
        const odgovor = await KlubService.get();
        setPodaci(odgovor.data.map((klub) => {
            return {
                y: klub.igraci.length,
                name: klub.naziv,
            };
        }));
    }

    useEffect(() => {
        getPodaci();
    }, []);

    const fixedOptions = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
        },
        title: {
            text: 'Broj igrača po klubu',
            align: 'left',
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
            enabled: false,
            point: {
                valueSuffix: '%',
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>',
                },
            },
        },
    };





    return (
         
             <>
            <Container className='mt-4'>
                {podaci.length > 0 && (
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                            ...fixedOptions,
                            series: [
                                {
                                    name: 'Igrači',
                                    colorByPoint: true,
                                    data: podaci,
                                },
                            ],
                        }}
                    />
                )}
            </Container>
        </>
    )
}