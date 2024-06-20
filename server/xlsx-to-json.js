function formatTime(decimalTime) {
    const hours = Math.floor(decimalTime * 24);
    const minutes = Math.floor((decimalTime * 24 - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} hrs`;
}

function sheetToJson(sheet) {

    function checkCells(cells, sheet) {
        return cells.some(cell => {
            const cellValue = sheet[cell] ? sheet[cell].v : undefined;
            return cellValue !== undefined;
        });
    }

    const jsonData = [];
    let row = 8;
    let cells = [
        'B' + row,
        'C' + row,
        'D' + row,
        'E' + row,
        'F' + row,
        'G' + row,
        'H' + row,
        'I' + row,
    ]

    while (checkCells(cells, sheet)) {
        const cell = sheet['C' + row];
        if(cell && cell.s && cell.s.bgColor && cell.s.bgColor.rgb === '00FF00'){
            const speakers = []

            const timeCell = sheet['E' + row] && sheet['E' + row].v ? 'E' : 'F'
            const speakersCell = sheet['F' + row] && sheet['F' + row].v && typeof sheet['F' + row].v == 'number' ? 'G' : 'F'
            const descriptionCell = sheet['I' + row] && sheet['I' + row].v ? 'I' : 'J'

            if (sheet[speakersCell + row] && sheet[speakersCell + row].v) {
                const speaker = sheet[speakersCell + row].v.split(', ')
                speakers.push({
                    name: speaker[0],
                    position: speaker[1] ? speaker[1].charAt(0).toUpperCase() + speaker[1].slice(1) : '',
                    company: '',
                    image: '/profile.svg'
                })
            }
            const rowData = {
                title: sheet['C' + row] ? sheet['C' + row].v : '',
                description: sheet[descriptionCell + row] ? sheet[descriptionCell + row].v || '' : '',
                time: formatTime(sheet[timeCell + row].v) || '',
                duration: sheet['D' + row] ? sheet['D' + row].v : '', 
                speakers: speakers
            };
            jsonData.push(rowData);
        }
        row++;
        cells = cells.map(cell => cell[0] + row);
    }

    return jsonData;
}

export default sheetToJson;