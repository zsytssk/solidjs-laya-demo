/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRenderer } from 'solid-js/universal';

import { createEle } from './createEle';

export * from './layaCom';

export const {
    render,
    effect,
    memo,
    createComponent,
    createElement,
    createTextNode,
    insertNode,
    insert,
    spread,
    setProp,
    mergeProps,
} = createRenderer({
    createElement(type: string) {
        return createEle(type);
    },
    createTextNode(_value) {
        //
    },
    replaceText(_textNode, _value) {
        //
    },
    setProperty(node: any, name: any, value: any) {
        const isEvent = name.startsWith('on');
        if (!isEvent) {
            node[name] = value;
            return;
        }
        const eventName = name.substr(2).toLowerCase();
        node.on(eventName, node, value);
    },
    insertNode(parent: any, node: any, anchor: any) {
        const index = parent.getChildIndex(anchor);
        if (index !== -1) {
            parent.addChildAt(node, index);
        } else {
            parent.addChild(node);
        }
    },
    isTextNode(_node: any) {
        return false;
    },
    removeNode(parent: any, node: any) {
        parent.removeChild(node);
    },
    getParentNode(node: any) {
        return node.parent;
    },
    getFirstChild(node: any) {
        return node.getChildAt(0);
    },
    getNextSibling(node: any) {
        const parent = node.parent;
        if (!parent) {
            return null;
        }
        const index = parent.getChildIndex(node);
        return parent.getChildAt(index + 1);
    },
});
