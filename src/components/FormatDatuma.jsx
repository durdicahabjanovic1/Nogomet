export default function FormatDatuma({ datum }) {
    if (!datum) {
        return <span>-</span>;
    }

    const d = new Date(datum);
    if (isNaN(d.getTime())) {
        return <span>{datum}</span>;
    }

    return <span>{d.toLocaleDateString('hr-HR')}</span>;
}