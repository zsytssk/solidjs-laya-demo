import { Item } from '../parse';
import { addLayaToName, genTab, upperFirstChar } from '../utils';
import { convertValue, Val } from './convertValue';

const jsx_tpl1 = `<$1 $2>$3$4</$1>`;
const jsx_tpl2 = `<$1 $2 />`;

const ignore_props = ['sceneColor', 'sceneBg', 'runtime', 'var'];

export function convertObjToXml(obj: Item, deep = 0, addProps = false) {
    const { name, props, isLayaCom } = obj;
    let { children } = obj;
    let props_str = '';
    let children_str = '';

    if (name === 'List') {
        props.itemRender = { type: 'returnJsx', children: children } as Val;
        children = [];
    }
    for (const key in props) {
        if (ignore_props.indexOf(key) !== -1) {
            continue;
        }
        let value = props[key];
        value = convertValue(value, key, deep);
        props_str += `${key}=${value} `;
    }
    props_str = props_str.trimRight();
    for (const item of children) {
        const { jsx: item_jsx } = convertObjToXml(item, deep + 1);
        children_str += genTab(deep + 1) + `${item_jsx}`;
    }

    let jsx = '';
    if (children_str) {
        jsx = jsx_tpl1.replace(/\$3/g, children_str);
        jsx = jsx.replace(/\$4/g, genTab(deep));
    } else {
        jsx = jsx_tpl2;
    }
    if (addProps) {
        props_str += ` {...props}`;
    }
    if (isLayaCom) {
        jsx = jsx.replace(/\$1/g, addLayaToName(name));
    } else {
        jsx = jsx.replace(/\$1/g, upperFirstChar(name));
    }
    jsx = jsx.replace(/\$1/g, name);
    jsx = jsx.replace(/\$2/, props_str);

    return {
        jsx,
    };
}
