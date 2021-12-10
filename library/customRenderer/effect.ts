import { Accessor, createRenderEffect, onCleanup } from 'solid-js';

import { Laya } from 'Laya';
import { Sprite } from 'laya/display/Sprite';

import { isClosest } from './utils';

export function createResizeEffect(
    fn: (width: number, height: number) => void,
) {
    createRenderEffect(() => {
        const { stage } = Laya;
        if (!stage) {
            return;
        }

        const resize = () => {
            fn(stage.width, stage.height);
        };
        stage.on(Laya.Event.RESIZE, this, resize);
        resize();

        onCleanup(() => {
            stage.off(Laya.Event.RESIZE, this, resize);
        });
    });
}

export function createClickOutSideEffect(
    ele: Accessor<Sprite>,
    bindFn: () => void,
) {
    createRenderEffect(() => {
        const node = ele();

        if (!node) {
            return;
        }

        const fn = (e) => {
            if (!node.visible) {
                return;
            }
            if (!isClosest(e.target, node)) {
                bindFn();
            }
        };
        Laya.stage.on('click', node, fn);

        onCleanup(() => {
            console.log(`test:>onCleanup`);
            Laya.stage.off('click', node, fn);
        });
    });
}
