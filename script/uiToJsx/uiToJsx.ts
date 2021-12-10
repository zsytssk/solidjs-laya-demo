import * as path from 'path';

import { walk } from '../zutil/ls/walk';
import { write } from '../zutil/ls/write';
import { stringify } from '../zutil/utils/stringify';
import { convertFile } from './convert';
import { parseFile, ParseFileInfo } from './parse';
import { parseUIView } from './parse/parseUIView';
import { isPrime } from './utils';

const src_path = path.resolve(__dirname, '../../laya/pages');
const dist_path = path.resolve(__dirname, '../../src/ui');

export type FileItem = {
    name: string;
    file_path: string;
} & ParseFileInfo;

type ParsePool = {
    [key: string]: FileItem;
};

type PropsPool = {
    [key: string]: Record<string, unknown>;
};

const props_pool = {} as PropsPool;

const parse_pool = {} as ParsePool;

async function main() {
    const files = await walk(src_path);
    for (const file of files) {
        const { name, dir } = path.parse(file);
        const rel_dir = path.relative(src_path, dir);
        const file_path = path.resolve(dist_path, rel_dir, `${name}.tsx`);

        let data = await parseFile(file);
        data = await parseUIView(data, {
            dist_path,
            file_path,
        });

        if (name === 'hall') {
            console.log(`test:>`, name, file);
            await write('./test.json', stringify(data, 100));
        }

        const pool_key = path.relative(src_path, file);

        parse_pool[pool_key] = { ...data, file_path, name };
    }

    for (const [key, val] of Object.entries(parse_pool)) {
        const { name, file_path, ...data } = val;
        const props = props_pool[key];
        const content = convertFile(name, data, props);
        await write(file_path, content);
    }
}

export function injectPropsTypePool(
    source: string,
    props: Record<string, unknown>,
) {
    let ori_props = props_pool[source];
    if (!ori_props) {
        props_pool[source] = ori_props = {};
    }

    for (const [key, val] of Object.entries(props)) {
        const ori_prop_type = ori_props[key];
        const new_type = typeof val;
        if (!ori_prop_type) {
            ori_props[key] = new_type;
            continue;
        }
        if (Array.isArray(ori_prop_type)) {
            if (ori_prop_type.indexOf(new_type) === -1) {
                ori_prop_type.push(new_type);
            }
            continue;
        } else {
            if (new_type !== ori_prop_type) {
                ori_props[key] = [ori_prop_type, new_type];
            }
            continue;
        }
    }
}
main();
