import {
    createMemo,
    createRenderEffect,
    createSignal,
    onCleanup,
} from 'solid-js';

import { Laya } from 'Laya';
import { LayaBox, LayaSprite } from 'customRenderer/layaCom';
import { Box } from 'laya/ui/Box';

import { Sprite } from '@app/utils/animate';

import { createClickOutSideEffect, createResizeEffect } from '../effect';
import { addPop, removePop } from './popManager';

type PopProps = {
    width: number;
    height: number;
    visible: boolean;
    hideBg?: boolean;
    onClickOutside?: () => void;
    popRef?: (ref: Box) => void;
    popWrapRef?: (ref: Box) => void;
};
export function Pop(props: ComProps & PopProps) {
    const [x, setX] = createSignal(0);
    const [y, setY] = createSignal(0);
    const [localPopRef, setLocalPopRef] = createSignal<Box>();

    const [maskLayerSignal, setMaskLayerSignal] = createSignal<Sprite>();

    createResizeEffect(() => {
        const maskLayer = maskLayerSignal();
        if (!Laya.stage) {
            return;
        }
        const { width: stage_width, height: stage_height } = Laya.stage;
        const x = (stage_width - props.width || 0) / 2;
        const y = (stage_height - props.height || 0) / 2;
        setX(x);
        setY(y);

        if (!maskLayer) {
            return;
        }

        if (maskLayer) {
            maskLayer.alpha = 0.5;
            maskLayer.graphics.clear();
            maskLayer.graphics.drawRect(
                0,
                0,
                stage_width,
                stage_height,
                'black',
            );
        }
    });

    createResizeEffect(() => {
        props.popRef?.(localPopRef());
    });

    const Element = createMemo(() => () => (
        <LayaBox ref={props.popWrapRef} visible={props.visible}>
            {props.hideBg ? null : <LayaSprite ref={setMaskLayerSignal} />}
            <LayaBox
                x={x()}
                y={y()}
                width={props.width}
                height={props.height}
                ref={setLocalPopRef}
            >
                {props.children}
            </LayaBox>
        </LayaBox>
    ));

    if (props.onClickOutside) {
        createClickOutSideEffect(localPopRef, props.onClickOutside);
    }

    createRenderEffect(() => {
        const pop_node = Element();

        addPop(pop_node, props.name);

        onCleanup(() => {
            removePop(pop_node, props.name);
        });
    });

    return null;
}
