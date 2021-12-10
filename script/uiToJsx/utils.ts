export function genTab(n: number, withBr = true) {
    let result = withBr ? '\n' : '';
    for (let i = 0; i < n; i++) {
        result += '    ';
    }
    return result;
}

const prime_arr = ['string', 'number', 'boolean'];
export function isPrime(item: unknown) {
    return prime_arr.indexOf(typeof item) !== -1;
}

export function addLayaToName(name: string) {
    const first_char = name[0];
    const upper_char = first_char.toUpperCase();
    name = name.replace(first_char, upper_char);
    return `Laya${name}`;
}
export function upperFirstChar(name: string) {
    const first_char = name[0];
    const upper_char = first_char.toUpperCase();
    name = name.replace(first_char, upper_char);
    return name;
}
