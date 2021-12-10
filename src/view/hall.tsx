import { createSignal } from 'solid-js';

import { LayaButton, LayaImage, LayaSprite } from 'customRenderer';
import { Scene } from 'customRenderer/Component/scene';
import { createResizeEffect } from 'customRenderer/effect';
import { Box } from 'laya/ui/Box';

import { setCurSceneSignal } from '@app/main';
import { res } from '@app/res';
import { LoadingWrap } from '@app/view/loading';

import { alert } from './pop/alert';

export const Hall = LoadingWrap(HallInner, res.hall);

function HallInner(props: any) {
    const [innerSignal, setInnerSignal] = createSignal<Box>();

    createResizeEffect((width, _height) => {
        if (width > 1920) {
            width = 1920;
        }

        const inner = innerSignal();
        if (inner) {
            inner.width = width;
        }
    });

    return (
        <Scene
            width={1920}
            height={750}
            center={true}
            autoDestroyAtClosed={true}
            {...props}
        >
            <LayaImage
                top={0}
                skin="images/hall/bg2.jpg"
                right={0}
                left={0}
                bottom={0}
            />
            <LayaImage
                onClick={() => setCurSceneSignal('game')}
                centerX={0}
                y={564}
                skin="images/hall/btn_bg.png"
            >
                <LayaImage y={18} x={204.5} skin="images/hall/text_play.png" />
                <LayaSprite y={28} x={26} texture="images/hall/icon_play.png" />
                <LayaSprite y={35} x={508} texture="images/hall/icon_go.png" />
            </LayaImage>
            <LayaButton
                y={38}
                x={1106}
                stateNum={1}
                onClick={() => {
                    alert('一条提示信息');
                }}
                skin="images/hall/btn_prompt.png"
            />
        </Scene>
    );
}
