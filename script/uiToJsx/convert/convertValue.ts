import { Item } from '../parse';
import { genTab, isPrime } from '../utils';
import { convertObjToXml } from './convertObjToXml';

const is_num_props = ['stateNum'];
const fun_tpl1 = `{() => ($1)}`;
const fun_tpl2 = `{() => (<>$1</>)}`;
export type Val =
    | string
    | number
    | boolean
    | boolean
    | {
          type: 'returnJsx';
          children: Item[];
      };

export function convertValue(val: Val, key: string, deep: number): string {
    if (is_num_props.indexOf(key) !== -1) {
        return `{${val}}`;
    } else if (typeof val === 'string') {
        if (val.indexOf(`"`) !== -1 || val.indexOf(`'`) !== -1) {
            return `{\`${val}\`}`;
        }
        return `"${val}"`;
    } else if (isPrime(val)) {
        return `{${val}}`;
    }
    let children = (val as any).children;

    let children_str = '';
    if (children.length === 1) {
        children = children[0];
        const { jsx } = convertObjToXml(children, deep + 1);
        children_str += genTab(deep + 1) + `${jsx}` + genTab(deep);
        return fun_tpl1.replace(`$1`, children_str);
    }

    for (const item of children) {
        const { jsx: item_jsx } = convertObjToXml(item, deep + 1);
        children_str += genTab(deep + 1) + `${item_jsx}`;
    }
    return fun_tpl2.replace(`$1`, children_str);
}
