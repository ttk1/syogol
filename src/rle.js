exports.encode = (original, dict) => {
    var encoded = '';
    for (let i = 0; i < original.length; i++) {
        let run_length = get_run_length(original, i) % dict.length;
        encoded += dict[run_length] + original.charAt(i);
        i += run_length;
    }
    return encoded;

    function get_run_length(str, pos) {
        var count = 0;
        const target_char = str.charAt(pos);
        for (let i = pos + 1; i < str.length; i++) {
            if (str.charAt(i) == target_char) {
                count++;
                continue;
            }
            break;
        }
        return count;
    }
}

exports.decode = (encoded, dict) => {
    var decoded = '';
    for (let i = 0; i < encoded.length; i += 2) {
        decoded += encoded.charAt(i + 1)
            .repeat(dict.indexOf(encoded.charAt(i)) + 1);
    }
    return decoded;
}