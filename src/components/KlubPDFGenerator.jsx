import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export default function KlubPDFGenerator({ klub, igraci }) {

    const fetchFontAsBase64 = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Font nije pronađen: ${url}`);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });
    };



    const generirajPDF = async () => {
        const [regBase64, boldBase64] = await Promise.all([
            fetchFontAsBase64('/fonts/Roboto-Medium.ttf'),
            fetchFontAsBase64('/fonts/Roboto-Bold.ttf')
        ]);

        const doc = new jsPDF();

        doc.addFileToVFS('Roboto-Medium.ttf', regBase64);
        doc.addFont('Roboto-Bold.ttf', 'Roboto', 'normal');
        doc.addFileToVFS('Roboto-Bold.ttf', boldBase64);
        doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

        const primaryColor = [30, 86, 49];   
        const secondaryColor = [100, 116, 139]; 
        const textColor = [30, 41, 59];     

    
        doc.setFont('Roboto', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(...primaryColor);
        doc.text('NOGOMET', 15, 20);

        doc.setFont('Roboto', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...secondaryColor);
        doc.text('EVIDENCIJA KLUBOVA I IGRAČA', 15, 26);

    
        doc.setDrawColor(255, 0, 0);
        doc.setLineWidth(0.8);
        doc.line(15, 30, 195, 30);


        doc.setFont('Roboto', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...textColor);
        doc.text(`Izvješće za klub: ${ klub?.naziv || 'N/A' } `, 15, 42);


        let currentY = 52;

        autoTable(doc, {
            startY: currentY,
            margin: { left: 15, right: 15 },
            theme: 'plain',
            styles: { font: 'Roboto', fontSize: 9.5, textColor: textColor, cellPadding: 3 },
            columnStyles: {
                0: { fontStyle: 'bold', textColor: primaryColor, width: 85 },
                1: { fontStyle: 'bold', textColor: primaryColor, width: 85 }
            },
            head: [['PODACI O GRUPI', 'PODACI O SMJERU']],
            body: [
                [
                    `Naziv: ${ klub?.naziv || '-' } `,
                    `Mjesto: ${ mjesto?.naziv || '-' } `
                ],
                [
                    `Broj igraca: ${ igraci?.length || 0 } `,
                    `Trajanje: ${ klub?.trajanje ? `${klub.trajanje} sati` : '-' } `
                ],
                [
                    '',
                    `Akcija: ${ formatirajAkciju(klub?.akcija) } `
                ],
                [
                    '',
                    `Datum pokretanja: ${ klub?.datumPokretanja ? new Date(klub.datumPokretanja).toLocaleDateString('hr-HR') : '-' } `
                ],
                [
                    '',
                    `Status kluba: ${ klub?.aktivan ? 'Aktivan' : 'Neaktivan' } `
                ]
            ],
            didParseCell: (data) => {
                if (data.section === 'head') {
                    data.cell.styles.fillColor = [241, 245, 249];
                    data.cell.styles.textColor = primaryColor;
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        currentY = doc.lastAutoTable.finalY + 12;


        doc.setFont('Roboto', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(...textColor);
        doc.text('Popis upisanih igraca', 7, currentY);

        currentY += 5;

        if (igraci && igraci.length > 0) {
            const tableData = igraci.map((p, index) => [
                index + 1,
                p.ime || '',
                p.prezime || '',
                p.brojDresa || '',
                p.brojKopackih || '' ,
                p.pozicija || '', 
                p.datumRodenja || '',
                p.brojRegistracije || '',
                p.klub || '',
            ]);

            autoTable(doc, {
                startY: currentY,
                margin: { left: 15, right: 15 },
                head: [['#', 'Ime', 'Prezime', 'BrojDresa', 'BrojKopackih', Pozicija, DatumRodenja, BrojRegistracije, Klub]],
                body: tableData,
                styles: {
                    font: 'Roboto',
                    fontSize: 9,
                    textColor: textColor,
                    cellPadding: 4,
                    overflow: 'linebreak'
                },
                headStyles: {
                    font: 'Roboto',
                    fontStyle: 'bold',
                    fillColor: primaryColor,
                    textColor: [255, 255, 255],
                    halign: 'left'
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                },
                columnStyles: {
                    0: { cellWidth: 15, halign: 'center' },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 35 },
                    3: { cellWidth: 65 },
                    4: { cellWidth: 35 }
                }
            });
        } else {
            doc.setFont('Roboto', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(...secondaryColor);
            doc.text('Trenutačno nema upisanih igraca u ovoj klubu.', 7, currentY + 7);
        }

   
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.4);
            doc.line(15, doc.internal.pageSize.getHeight() - 15, 195, doc.internal.pageSize.getHeight() - 15);

            doc.setFont('Roboto', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...secondaryColor);
            
            doc.text(
                `Generirano: ${ new Date().toLocaleString('hr-HR') } `,
                15,
                doc.internal.pageSize.getHeight() - 8
            );

            doc.text(
                `Stranica ${ i } od ${ pageCount } `,
                doc.internal.pageSize.getWidth() - 25,
                doc.internal.pageSize.getHeight() - 8,
                { align: 'right' }
            );
        }

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    return generirajPDF;
}