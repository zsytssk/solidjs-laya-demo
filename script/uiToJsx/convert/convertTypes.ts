const type_item_tpl = `name?: type`;
const type_tpl = `{$1}`;

export function convertTypes(type_props: Record<string, unknown>) {
    if (!type_props) {
        return 'any';
    }

    let str = '';
    for (const [key, prop] of Object.entries(type_props)) {
        let item_str = type_item_tpl.replace('name', key);
        let type_str = '';
        if (Array.isArray(prop)) {
            for (const [index, item] of prop.entries()) {
                type_str += `${item}}`;
                if (index !== 0) {
                    type_str += ` | `;
                }
            }
        } else {
            type_str = `${prop}`;
        }
        item_str = item_str.replace('type', type_str);

        str += `${item_str};`;
    }

    return type_tpl.replace(`$1`, str);
}
