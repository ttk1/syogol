const DICT = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_'
]

exports.dict = DICT;

exports.ser = field => {
    if (!field.width || 255 < field.width || !field.height || 255 < field.height) {
        throw new Error('フィールドのサイズが異常です。');
    }
    if (field.cell_size <= 0 || 63 < field.cell_size) {
        throw new Error('セルのサイズが異常です。');
    }

    const width = left_padding(field.width.toString(2), 8);
    const height = left_padding(field.height.toString(2), 8);
    const cell_size = left_padding(field.cell_size.toString(2), 6);

    var field_bin = width + height + cell_size;
    for (let x = 0; x < field.width; x++) {
        for (let y = 0; y < field.height; y++) {
            if (!field.field[x] || typeof field.field[x][y] != 'boolean') {
                throw new Error('フィールドが異常です。');
            }
            field_bin += Number(field.field[x][y]).toString(2)
        }
    }
    return split_field_bin(field_bin).map(bin => DICT[parseInt(bin, 2)]).join('');

    function split_field_bin(field_bin) {
        var splitted = [];
        for (let i = 0; i < field_bin.length; i += 6) {
            splitted.push(right_padding((field_bin.slice(i, i + 6)), 6));
        }
        return splitted;
    }
}

exports.de = field_str => {
    const field_bin = field_str.split('')
        .map(base64 => DICT.indexOf(base64))
        .map(bin => left_padding(bin.toString(2), 6)).join('');
    const width = parseInt(field_bin.slice(0, 8), 2);
    const height = parseInt(field_bin.slice(8, 16), 2);
    const cell_size = parseInt(field_bin.slice(16, 22), 2);
    const field = {
        width: width,
        height: height,
        cell_size: cell_size,
        field: []
    }
    var read_pos = 22;
    for (let x = 0; x < field.width; x++) {
        field.field[x] = [];
        for (let y = 0; y < field.height; y++, read_pos++) {
            if (field_bin.length <= read_pos) {
                throw new Error('フィールドのサイズが異常です。');
            }
            field.field[x][y] = field_bin.charAt(read_pos) == '1';
        }
    }
    return field;
}

function left_padding(str, length) {
    if (length <= str.length) {
        return str;
    }
    return (Array(length).join('0') + str).slice(-length);
}

function right_padding(str, length) {
    if (length <= str.length) {
        return str;
    }
    return (str + Array(length).join('0')).slice(-length);
}