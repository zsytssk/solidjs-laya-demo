/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRenderEffect } from 'solid-js';

import { type Node } from 'laya/display/Node';
import { FilterSetterBase } from 'laya/effect/FilterSetterBase';

export function setProp(node: any, name: string, value: any) {
    const isEvent = name.startsWith('on');
    if (!isEvent) {
        node[name] = value;
        return;
    }
    const eventName = name.slice(2).toLowerCase();
    node.on(eventName, node, value);
}

export function insertExpression(parent: any, children: any) {
    if (!children) {
        return;
    }

    if (!Array.isArray(children)) {
        children = [children];
    }
    for (const child of children as any) {
        if (typeof child === 'function') {
            createRenderEffect(() => {
                const items = child();
                insertExpression(parent, items);
            });
            continue;
        }

        if (Array.isArray(child)) {
            insertExpression(parent, child);
            continue;
        }

        if (child instanceof FilterSetterBase) {
            child.target = parent;
            continue;
        }

        parent.addChild(child);
    }

    return children;
}

export function isClosest(dom_item: Node, dom_parent: Node) {
    if (!dom_item) {
        return false;
    }
    if (dom_item === dom_parent) {
        return true;
    }
    const parent = dom_item.parent;
    return isClosest(parent, dom_parent);
}
