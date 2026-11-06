

import { Button, Table } from "react-bootstrap";
import { GrValidate } from "react-icons/gr";
import { FaEdit, FaFilePdf, FaTrash } from "react-icons/fa";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useState } from "react";

export default function KlubPregledTablica({ klubovi, navigate, obrisi,generirajPDFZaKlub }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = null;
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey || sortConfig.direction === null) {
            return <FaSort />;
        }
        return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    const sortedKlubovi = () => {
        if (!klubovi || sortConfig.direction === null) {
            return klubovi;
        }


        const sorted = [...klubovi].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Obrada null/undefined vrijednosti
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            // Sortiranje prema tipu podatka: Date
            if (sortConfig.key === 'datumPokretanja') {
                const dateA = new Date(aValue);
                const dateB = new Date(bValue);
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Sortiranje prema tipu podatka: boolean
            if (sortConfig.key === 'aktivan') {
                const valA = aValue ? 1 : 0;
                const valB = bValue ? 1 : 0;
                return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
            }

            // Sortiranje prema tipu podatka: string
            if (typeof aValue === 'string') {
                // localeCompare s 'hr' parametrom rješava čšćđž ČŠĆĐŽ
                const result = aValue.localeCompare(bValue, 'hr', { sensitivity: 'accent' });
                return sortConfig.direction === 'asc' ? result : -result;
            }

            return 0
        })
        return sorted
    }


    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th onClick={() => handleSort('naziv')} style={{ cursor: 'pointer' }}>
                        Naziv {getSortIcon('naziv')}
                    </th>
                    <th onClick={() => handleSort('mjesto')} style={{ cursor: 'pointer' }}>
                        Mjesto {getSortIcon('mjesto')}
                    </th>
                 
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {sortedKlubovi() && sortedKlubovi().map((klub) => (
                    <tr key={klub.sifra}>
                        <td className="lead"> 
                            <FaFilePdf
                                    color="#cb72dd"
                                    style={{ cursor: 'hand' }}
                                    onClick={() => generirajPDFZaKlub(klub)} title="Generiraj PDF" />
                            {klub.naziv}</td>
                        <td className='text-end'>{klub.mjesto} </td>
                  
                        <td>
                            <Button onClick={() => navigate(`/klubovi/${klub.sifra}`)} title="Promjeni">
                                <FaEdit />
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                variant="danger" onClick={() => obrisi(klub.sifra)} title="Obriši">
                                <FaTrash />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}