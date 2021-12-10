/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFile } from '../../zutil/ls/asyncUtil';

export type Item = {
    name: string;
    isLayaCom?: boolean;
    props: { [key: string]: any };
    children: Item[];
};

export type ParseFileInfo = {
    info: Item;
    import_map: { [key: string]: string[] };
};

export async function parseFile(file: string): Promise<ParseFileInfo> {
    const con = await readFile(file);
    const json_con = JSON.parse(con);

    const { item: info, import_laya_arr } = parseItem(json_con);

    const import_map = {
        ['customRenderer']: import_laya_arr,
    } as ParseFileInfo['import_map'];

    return { info, import_map };
}

export function parseItem(info: any): {
    item: Item;
    import_laya_arr: string[];
} {
    const { type: name, props, child } = info;

    const children = [] as Item[];
    let import_laya_arr = [] as string[];

    if (name === 'UIView') {
        props.source = info.source;
    } else {
        import_laya_arr.push(name);
    }

    for (const item_info of child) {
        const { item, import_laya_arr: item_types } = parseItem(item_info);

        import_laya_arr = import_laya_arr.concat(item_types);
        children.push(item);
    }

    return {
        import_laya_arr,
        item: {
            name,
            props,
            children,
        },
    };
}
