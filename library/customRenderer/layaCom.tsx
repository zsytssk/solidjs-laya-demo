/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRenderEffect, onCleanup, splitProps } from 'solid-js';

import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Templet } from 'laya/ani/bone/Templet';
import { Animation } from 'laya/display/Animation';
import { Node } from 'laya/display/Node';
import { Scene } from 'laya/display/Scene';
import { Sprite } from 'laya/display/Sprite';
import { Stage } from 'laya/display/Stage';
import { Text } from 'laya/display/Text';
import { BlurFilterSetter } from 'laya/effect/BlurFilterSetter';
import { ColorFilterSetter } from 'laya/effect/ColorFilterSetter';
import { FilterSetterBase } from 'laya/effect/FilterSetterBase';
import { GlowFilterSetter } from 'laya/effect/GlowFilterSetter';
import { Event } from 'laya/events/Event';
import { HTMLDivElement } from 'laya/html/dom/HTMLDivElement';
import { Box } from 'laya/ui/Box';
import { Button } from 'laya/ui/Button';
import { CheckBox } from 'laya/ui/CheckBox';
import { Clip } from 'laya/ui/Clip';
import { ComboBox } from 'laya/ui/ComboBox';
import { Dialog } from 'laya/ui/Dialog';
import { FontClip } from 'laya/ui/FontClip';
import { HBox } from 'laya/ui/HBox';
import { HScrollBar } from 'laya/ui/HScrollBar';
import { HSlider } from 'laya/ui/HSlider';
import { Image } from 'laya/ui/Image';
import { Label } from 'laya/ui/Label';
import { List } from 'laya/ui/List';
import { Panel } from 'laya/ui/Panel';
import { ProgressBar } from 'laya/ui/ProgressBar';
import { Radio } from 'laya/ui/Radio';
import { RadioGroup } from 'laya/ui/RadioGroup';
import { Tab } from 'laya/ui/Tab';
import { TextArea } from 'laya/ui/TextArea';
import { TextInput } from 'laya/ui/TextInput';
import { VBox } from 'laya/ui/VBox';
import { View } from 'laya/ui/View';

import { convertHandler } from './convertHandler';
import { insertExpression, setProp } from './utils';

export interface EventProps {
    onMouseOver?(evt: Event): void;
    onMouseMove?(evt: Event): void;
    onMouseOut?(evt: Event): void;
    onMouseEnter?(evt: Event): void;
    onMouseLeave?(evt: Event): void;
    onMouseDown?(evt: Event): void;
    onMouseUp?(evt: Event): void;
    onWheel?(evt: Event): void;
    onClick?(evt: Event): void;
    onRightClick?(evt: Event): void;
    onDoubleClick?(evt: Event): void;
    onTouchStart?(evt: Event): void;
    onTouchMove?(evt: Event): void;
    onTouchEnd?(evt: Event): void;
    onDragStart?(evt: Event): void;
    onDragMove?(evt: Event): void;
    onDragEnd?(evt: Event): void;
    onDragEnd?(evt: Event): void;
    onResize?(evt: Event): void;
}

export type ExtraProps<T> = {
    ref?: (ref: T) => void;
    renderType?: string;
    children?: any;
    texture?: string;
    selectHandler?: (index: number, self: List) => void;
    renderHandler?: (box: Box, index: number, self: List) => void;
};

function createCom<T extends Node>(LayCtor: Ctor<T>) {
    return (props: Partial<T> | EventProps | ExtraProps<T>) => {
        const [local, otherProps] = splitProps(
            props as Partial<T> & ExtraProps<T>,
            ['children', 'ref'],
        );

        const ele = new LayCtor();

        let preProps = {} as typeof otherProps;
        createRenderEffect(() => {
            // console.log(`test:>layaCom:>props`);
            for (const key in otherProps) {
                let value = otherProps[key];
                if (preProps[key] === value) {
                    continue;
                }
                value = convertHandler(key, value, ele);
                preProps[key] = value;
                setProp(ele, key, value);
            }
        });

        createRenderEffect(() => {
            local.ref?.(ele);
        });

        createRenderEffect(() => {
            // console.log(`test:>layaCom:>children`);
            const children = local.children;
            insertExpression(ele, children);
        });

        onCleanup(() => {
            // console.log(`test:>layaCom:>onCleanup`);
            preProps = undefined;
            (ele as any).parent?.removeChild(ele);
        });

        return ele as any;
    };
}

function createFilterSetterCom<T extends FilterSetterBase>(LayCtor: Ctor<T>) {
    return (props: Partial<T> | EventProps | ExtraProps<T>) => {
        const ele = new LayCtor();

        let preProps = {} as typeof props;
        createRenderEffect(() => {
            for (const key in props) {
                const value = props[key];
                if (preProps[key] === value) {
                    continue;
                }
                preProps[key] = value;
                setProp(ele, key, value);
            }
        });

        onCleanup(() => {
            preProps = undefined;
            if ((ele as any)._target) {
                const filter = (ele as any)._filter;
                const filters = (ele as any)._target.filters;
                const index = filters.indexOf(filter);
                if (index !== -1) {
                    filters.splice(index, 1);
                    (ele as any)._target.filters = [...filters];
                }
                (ele as any).target = undefined;
                (ele as any).filter = undefined;
            }
        });
        return ele as any;
    };
}

export const LayaList = createCom<List>(List);
export const LayaStage = createCom(Stage);
export const LayaView = createCom(View);
export const LayaNode = createCom(Node);
export const LayaLabel = createCom(Label);
export const LayaBox = createCom(Box);
export const LayaButton = createCom(Button);
export const LayaHBox = createCom(HBox);
export const LayaVBox = createCom(VBox);
export const LayaImage = createCom(Image);
export const LayaClip = createCom(Clip);
export const LayaComboBox = createCom(ComboBox);
export const LayaTab = createCom(Tab);
export const LayaHScrollBar = createCom(HScrollBar);
export const LayaHSlider = createCom(HSlider);
export const LayaCheckBox = createCom(CheckBox);
export const LayaRadioGroup = createCom(RadioGroup);
export const LayaRadio = createCom(Radio);
export const LayaPanel = createCom(Panel);
export const LayaProgressBar = createCom(ProgressBar);
export const LayaTextInput = createCom(TextInput);
export const LayaText = createCom(Text);
export const LayaFontClip = createCom(FontClip);
export const LayaSprite = createCom(Sprite);
export const LayaTextArea = createCom(TextArea);
export const LayaHTMLDivElement = createCom(HTMLDivElement);
export const LayaAnimation = createCom(Animation);
export const LayaTemplet = createCom(Templet as any);
export const LayaDialog = createCom(Dialog);
export const LayaScene = createCom(Scene);
export const LayaSkeletonPlayer = createCom(Skeleton);

export const LayaGlowFilterSetter = createFilterSetterCom(GlowFilterSetter);
export const LayaColorFilterSetter = createFilterSetterCom(ColorFilterSetter);
export const LayaBlurFilterSetter = createFilterSetterCom(BlurFilterSetter);
