import { createEffect, createSignal } from 'solid-js';

import { LayaButton, LayaImage, LayaLabel, LayaSprite } from 'customRenderer';
import { Pop } from 'customRenderer/Component/pop';
import { Box } from 'laya/ui/Box';

import { fade_in, fade_out } from '@app/utils/animate';

const [visible, setVisible] = createSignal(false);
const [text, setText] = createSignal('');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let timeout: any;
export function alert(str: string, time = 3) {
    setVisible(true);
    setText(str);

    clearTimeout(timeout);
}

export function Alert(props: any) {
    const [popRef, setPopRef] = createSignal<Box>();
    const [popWrapRef, setPopWrapRef] = createSignal<Box>();

    createEffect(() => {
        const isShow = visible();
        const pop = popRef();
        const popWrap = popWrapRef();

        if (!popWrap || !pop) {
            return;
        }

        if (isShow) {
            popWrap.visible = true;
            fade_in(pop, 200);
        } else {
            fade_out(pop, 200).then(() => {
                setText('');
                popWrap.visible = false;
            });
        }
    });

    return (
        <Pop
            visible={visible()}
            width={658}
            height={427}
            popRef={setPopRef}
            popWrapRef={setPopWrapRef}
            onClickOutside={() => setVisible(false)}
            name="alert"
            {...props}
        >
            <LayaSprite y={0} x={0} texture="images/pop/bg_tip.png" />
            <LayaButton
                y={0}
                x={537}
                stateNum={1}
                onClick={() => setVisible(false)}
                skin="images/pop/btn_close.png"
            />
            <LayaImage y={6} x={86} skin="images/pop/text_tip.png" />
            <LayaButton
                y={308}
                x={208}
                stateNum={1}
                skin="images/pop/btn_sure.png"
            />
            <LayaLabel
                y={107}
                x={58.5}
                wordWrap={true}
                width={511}
                valign="middle"
                text={text() || '这是一个提示信息'}
                leading={20}
                height={167}
                fontSize={36}
                color="#fff"
                align="center"
            />
        </Pop>
    );
}
