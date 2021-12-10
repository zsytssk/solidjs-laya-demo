import { addLayaToName } from '../utils';

const import_tpl = `import $1 from '$2'`;

export function convertImport(import_map: { [key: string]: string[] }) {
    let import_str = '';
    for (const key in import_map) {
        let type_out = '';
        let type_inner = '';
        const types = import_map[key];
        const trim_types = types.filter((item, index) => {
            return types.indexOf(item) === index;
        });
        for (let type_item of trim_types) {
            let is_out = false;
            if (type_item.indexOf(':') !== -1) {
                is_out = true;
                type_item = type_item.replace(':', '');
            }
            if (key === 'customRenderer') {
                type_item = addLayaToName(type_item);
            }
            if (is_out) {
                type_out = `${type_item}`;
            } else {
                type_inner += `${type_item}, `;
            }
        }
        let type_str = `${type_out}`;
        if (type_inner) {
            if (type_str) {
                type_str += ', ';
            }
            type_inner = type_inner.substring(0, type_inner.length - 2);
            type_str += `{${type_inner}}`;
        }

        let item_str = import_tpl.replace('$2', key);
        item_str = item_str.replace('$1', type_str);
        import_str += `${item_str};\n`;
    }

    return import_str;
}
